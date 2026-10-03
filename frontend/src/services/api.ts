import { auth } from '../config/firebase';


const API_URL = 'http://127.0.0.1:8000';


export const getCurrentUser = async () => {

  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  // Get Firebase ID token
  const token = await user.getIdToken();

  // Send token to FastAPI
  const response = await fetch(
    `${API_URL}/auth/me`,
    {
      method: 'GET',

      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );


  if (!response.ok) {
    throw new Error(
      'Failed to authenticate with backend'
    );
  }


  return response.json();
};