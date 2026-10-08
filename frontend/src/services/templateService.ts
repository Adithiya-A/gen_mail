import { auth } from '../config/firebase';

const API_URL = 'http://127.0.0.1:8000';

export interface CreateTemplateData {
  name: string;
  subject: string;
  description: string;
  category: string;
  body: string;
  isDefault?: boolean;
  iconBg?: string;
}

export interface UpdateTemplateData {
  name?: string;
  subject?: string;
  description?: string;
  category?: string;
  body?: string;
  isDefault?: boolean;
  iconBg?: string;
}


export const createTemplate = async (
  templateData: CreateTemplateData
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}/templates/`, {
    method: 'POST',

    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(templateData),
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail || 'Failed to create template'
    );
  }

  return response.json();
};


export const getTemplates = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}/templates/`, {
    method: 'GET',

    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail || 'Failed to fetch templates'
    );
  }

  return response.json();
};


export const updateTemplate = async (
  templateId: string,
  templateData: UpdateTemplateData
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  const token = await user.getIdToken();

  const response = await fetch(
    `${API_URL}/templates/${templateId}`,
    {
      method: 'PUT',

      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(templateData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail || 'Failed to update template'
    );
  }

  return response.json();
};


export const deleteTemplate = async (
  templateId: string
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  const token = await user.getIdToken();

  const response = await fetch(
    `${API_URL}/templates/${templateId}`,
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
      errorData.detail || 'Failed to delete template'
    );
  }

  return response.json();
};