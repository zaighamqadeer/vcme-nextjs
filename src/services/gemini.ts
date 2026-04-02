import { auth } from '../firebase';

// Helper to get the API base URL
const getApiUrl = () => {
  // In production, this should point to your Cloud Run backend URL
  // You can set this in your .env file as VITE_API_URL
  return process.env.NEXT_PUBLIC_API_URL || 'https://vcmeserver-git-366135769212.europe-west1.run.app';
};

// Helper to get auth token
const getAuthToken = async () => {
  if (!auth.currentUser) throw new Error("User not authenticated");
  return await auth.currentUser.getIdToken();
};

export async function getVibeFeedback(prompt: string, userResponse: string) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${getApiUrl()}/api/gemini/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ prompt, userResponse }),
    });
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      rating: 5,
      feedback: "We couldn't evaluate your prompt right now, but try to be as specific as possible!",
      pass: true
    };
  }
}

export async function getHint(taskPrompt: string, userResponse: string) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${getApiUrl()}/api/gemini/hint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ taskPrompt, userResponse }),
    });
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.hint;
  } catch (error) {
    console.error("Gemini Hint Error:", error);
    return "Try to be more specific about the features and layout you want!";
  }
}
