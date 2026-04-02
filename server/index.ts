import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { getVibeFeedback, getHint } from "./gemini.js";
import { createCheckoutSession, handleStripeWebhook } from "./stripe.js";
import { auth, db } from "./firebaseAdmin.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Helper to get the base URL
const getBaseUrl = () => {
  if (process.env.APP_URL) return process.env.APP_URL;
  if (process.env.VITE_APP_URL) return process.env.VITE_APP_URL;
  return "http://localhost:3000";
};

// Middleware to verify Firebase ID token
const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await auth.verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error: any) {
    console.error('Error verifying auth token:', error);
    console.error('Error details:', error.message, error.code);
    res.status(401).json({ error: 'Unauthorized: Invalid token', details: error.message });
  }
};

// Rate limiting configurations
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: "Too many requests from this IP, please try again after 15 minutes" },
  validate: { xForwardedForHeader: false, default: true }
});

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 AI requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many AI requests, please try again later" },
  validate: { xForwardedForHeader: false, default: true }
});

async function startServer() {
  const app = express();

  // Trust the first proxy (Cloud Run / AI Studio infrastructure)
  // This is required for express-rate-limit to correctly identify client IPs
  app.set('trust proxy', 1);

  // Security headers
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP in dev, or configure it properly for production
    crossOriginEmbedderPolicy: false,
  }));

  // Enable CORS for frontend requests
  // In production, restrict this to your Cloudflare Pages domain
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    process.env.APP_URL,
    process.env.VITE_APP_URL
  ].filter(Boolean);

  app.use(cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // In development, we might want to be more permissive, but for "bulletproof" we should check
      if (process.env.NODE_ENV !== 'production') {
         return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) === -1) {
        var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  }));

  // Stripe Webhook MUST use raw body parser, so we define it before express.json()
  app.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    try {
      if (!sig) throw new Error("No signature");
      await handleStripeWebhook(sig as string, req.body);
      res.json({ received: true });
    } catch (err: any) {
      console.error("Webhook Error:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });

  // API routes FIRST
  app.use(express.json({ limit: '10kb' })); // Limit body size to prevent payload too large attacks

  // Apply general API rate limiter
  app.use("/api/", apiLimiter);

  // Gemini Endpoints (with stricter rate limiting)
  app.post("/api/gemini/feedback", authenticate, aiLimiter, async (req, res) => {
    try {
      const { prompt, userResponse } = req.body;
      if (!prompt || !userResponse) {
        return res.status(400).json({ error: "Missing prompt or userResponse" });
      }
      const feedback = await getVibeFeedback(prompt, userResponse);
      res.json(feedback);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/gemini/hint", authenticate, aiLimiter, async (req, res) => {
    try {
      const { taskPrompt, userResponse } = req.body;
      if (!taskPrompt || !userResponse) {
        return res.status(400).json({ error: "Missing taskPrompt or userResponse" });
      }
      const hint = await getHint(taskPrompt, userResponse);
      res.json({ hint });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Course Endpoints
  // Public endpoint for course outline
  app.get("/api/courses/:courseId/chapters", async (req, res) => {
    try {
      const { courseId } = req.params;
      const { CHAPTERS, AI_AGENTS_CHAPTERS, PROMPT_ENGINEERING_CHAPTERS, FULLSTACK_VIBE_CHAPTERS } = await import("./lessonsData.js");
      
      let chapters = [];
      if (courseId === 'advanced-ai-agents') chapters = AI_AGENTS_CHAPTERS;
      else if (courseId === 'prompt-engineering-pro') chapters = PROMPT_ENGINEERING_CHAPTERS;
      else if (courseId === 'fullstack-vibe') chapters = FULLSTACK_VIBE_CHAPTERS;
      else chapters = CHAPTERS; // vibe-coding is default

      // Strip sensitive content (content, options, correctAnswer, taskPrompt)
      const strippedChapters = chapters.map((chapter: any) => ({
        ...chapter,
        lessons: chapter.lessons.map((lesson: any) => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          type: lesson.type
        }))
      }));

      res.json(strippedChapters);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Authenticated endpoint for full lesson content
  app.get("/api/courses/:courseId/chapters/:chapterIndex/lessons/:lessonIndex", authenticate, async (req, res) => {
    try {
      const { courseId, chapterIndex, lessonIndex } = req.params;
      const { CHAPTERS, AI_AGENTS_CHAPTERS, PROMPT_ENGINEERING_CHAPTERS, FULLSTACK_VIBE_CHAPTERS } = await import("./lessonsData.js");
      
      let chapters = [];
      if (courseId === 'advanced-ai-agents') chapters = AI_AGENTS_CHAPTERS;
      else if (courseId === 'prompt-engineering-pro') chapters = PROMPT_ENGINEERING_CHAPTERS;
      else if (courseId === 'fullstack-vibe') chapters = FULLSTACK_VIBE_CHAPTERS;
      else chapters = CHAPTERS;

      const chapter = chapters[parseInt(chapterIndex)];
      if (!chapter) return res.status(404).json({ error: "Chapter not found" });

      const lesson = chapter.lessons[parseInt(lessonIndex)];
      if (!lesson) return res.status(404).json({ error: "Lesson not found" });

      res.json(lesson);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Checkout Session
  app.post("/api/create-checkout-session", authenticate, async (req, res) => {
    try {
      const { userId, email, baseUrl: clientBaseUrl } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      // Ensure the user is creating a session for themselves
      if ((req as any).user.uid !== userId) {
        return res.status(403).json({ error: "Forbidden: Cannot create session for another user" });
      }

      const baseUrl = clientBaseUrl || getBaseUrl();
      const session = await createCheckoutSession(userId, email, baseUrl);

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/verify-checkout-session", authenticate, async (req, res) => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }

      const stripeModule = await import("./stripe.js");
      const stripe = stripeModule.getStripe ? stripeModule.getStripe() : new (await import("stripe")).default(process.env.STRIPE_SECRET_KEY!);
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === 'paid') {
        const userId = session.client_reference_id;
        if (userId === (req as any).user.uid) {
          await db.collection('users').doc(userId).set({
            isPro: true,
            hearts: 999,
            hp: 100,
            updatedAt: new Date()
          }, { merge: true });
          return res.json({ success: true, isPro: true });
        }
      }
      res.json({ success: false, status: session.payment_status });
    } catch (error: any) {
      console.error("Verify Session Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware removed for Next.js

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
