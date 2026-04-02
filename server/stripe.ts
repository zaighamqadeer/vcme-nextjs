import Stripe from "stripe";
import { db } from "./firebaseAdmin.js";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("Stripe configuration is missing. Please set STRIPE_SECRET_KEY in the Settings menu.");
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export async function createCheckoutSession(userId: string, email: string, baseUrl: string) {
  const stripe = getStripe();
  const priceId = process.env.STRIPE_PRICE_ID;

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ["card"],
    line_items: [
      priceId 
        ? { price: priceId, quantity: 1 }
        : {
            price_data: {
              currency: "usd",
              product_data: {
                name: "justvibecode Pro - Early Bird Access",
                description: "Infinite hearts, all courses, and exclusive tasks.",
              },
              unit_amount: 1000, // $10.00
            },
            quantity: 1,
          },
    ],
    mode: "payment",
    customer_email: email,
    client_reference_id: userId,
    success_url: `${baseUrl}?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}?payment_cancelled=true`,
    metadata: {
      userId: userId,
    },
  };

  const session = await stripe.checkout.sessions.create(sessionParams);
  return session;
}

export async function handleStripeWebhook(signature: string, body: Buffer) {
  const stripe = getStripe();
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!endpointSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET");
  }

  const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;

    if (userId) {
      console.log(`Payment successful for user ${userId}. Upgrading to Pro...`);
      // Update the user's profile in Firestore to grant Pro status
      await db.collection('users').doc(userId).set({
        isPro: true,
        hearts: 999,
        hp: 100,
        updatedAt: new Date()
      }, { merge: true });
    }
  }

  return event;
}
