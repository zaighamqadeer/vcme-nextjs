import { auth } from '../firebase';

// Helper to get the API base URL
const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://vcmeserver-git-366135769212.europe-west1.run.app';
};

// Helper to get auth token
const getAuthToken = async () => {
  if (!auth.currentUser) throw new Error("User not authenticated");
  return await auth.currentUser.getIdToken();
};

export async function getCourseMetadata(courseId: string) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${getApiUrl()}/api/courses/${courseId}/metadata`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Course Metadata Fetch Error:", error);
    throw error;
  }
}

export async function getLessonContent(courseId: string, lessonId: string) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${getApiUrl()}/api/courses/${courseId}/lessons/${lessonId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Lesson Content Fetch Error:", error);
    throw error;
  }
}
