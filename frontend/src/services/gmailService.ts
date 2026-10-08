import { auth } from '../config/firebase';

const API_URL = 'http://127.0.0.1:8000';

// Start Gmail OAuth connection
export const connectGmail = async (): Promise<string> => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}/gmail/connect`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail || 'Failed to start Gmail connection'
    );
  }

  const data = await response.json();

  return data.authorization_url;
};


// Check Gmail connection status
export const getGmailStatus = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}/gmail/status`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail || 'Failed to check Gmail status'
    );
  }

  return response.json();
};

export const disconnectGmail = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}/gmail/disconnect`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail || 'Failed to disconnect Gmail'
    );
  }

  return response.json();
};