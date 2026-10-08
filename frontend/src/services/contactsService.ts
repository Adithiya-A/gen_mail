import { auth } from '../config/firebase';

const API_URL = 'http://127.0.0.1:8000';

export interface ContactCreate {
  name: string;
  email: string;
  role?: string;
  tag?: string;
}

export interface ContactUpdate {
  name?: string;
  email?: string;
  role?: string;
  tag?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  tag: string;
  created_at?: string;
  updated_at?: string;
}


// Get all contacts
export const getContacts = async (): Promise<Contact[]> => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}/contacts`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail || 'Failed to load contacts'
    );
  }

  return response.json();
};


// Create a contact
export const createContact = async (
  data: ContactCreate
): Promise<Contact> => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail || 'Failed to create contact'
    );
  }

  return response.json();
};


// Update a contact
export const updateContact = async (
  id: string,
  data: ContactUpdate
): Promise<Contact> => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}/contacts/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail || 'Failed to update contact'
    );
  }

  return response.json();
};


// Delete a contact
export const deleteContact = async (
  id: string
): Promise<{ message: string }> => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}/contacts/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail || 'Failed to delete contact'
    );
  }

  return response.json();
};