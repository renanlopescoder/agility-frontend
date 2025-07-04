export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface CreateContactRequest {
  name: string;
  email: string;
  phone: string;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export const getAllContacts = async (): Promise<Contact[]> => {
  const response = await fetch(`${API_BASE_URL}/contacts`);
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  return response.json();
}

export const getContactById = async (contactId: string): Promise<Contact> => {
  const response = await fetch(`${API_BASE_URL}/contacts/${contactId}`);
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  return response.json();
}

export const createContact = async (contactData: CreateContactRequest): Promise<Contact> => {
  const response = await fetch(`${API_BASE_URL}/contacts/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contactData),
  });
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  return response.json();
}

export const deleteContact = async (contactId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/contacts/${contactId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
}