import { auth } from '../config/firebase';

const API_URL = 'http://127.0.0.1:8000';

export interface CreateEmailData {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  scheduled_at?: string | null;
}

export const createEmail = async (
  emailData: CreateEmailData
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}/emails/`, {
    method: 'POST',

    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail || 'Failed to create email'
    );
  }

  return response.json();
};

export const getEmails = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}/emails/`, {
    method: 'GET',

    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail || 'Failed to fetch emails'
    );
  }

  return response.json();
};

export const updateEmail = async (
  emailId: string,
  emailData: {
    to?: string;
    cc?: string;
    bcc?: string;
    subject?: string;
    body?: string;
    scheduled_at?: string | null;
    status?: string;
  }
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  const token = await user.getIdToken();

  const response = await fetch(
    `${API_URL}/emails/${emailId}`,
    {
      method: 'PUT',

      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(emailData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail || 'Failed to update email'
    );
  }

  return response.json();
};


export const deleteEmail = async (
  emailId: string
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  const token = await user.getIdToken();

  const response = await fetch(
    `${API_URL}/emails/${emailId}`,
    {
      method: 'DELETE',

      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail || 'Failed to delete email'
    );
  }

  return response.json();
};