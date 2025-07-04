/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ContactDetails } from './ContactDetails';
import * as api from '../api/contacts';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../api/contacts');

describe('ContactDetails', () => {
  const mockContact = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+123456789',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state initially', async () => {
    (api.getContactById as jest.Mock).mockResolvedValueOnce(mockContact);

    render(
      <MemoryRouter>
        <ContactDetails contactId="1" />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading contact details/i)).toBeInTheDocument();

    await screen.findByText(/contact details/i);
  });

  it('displays contact data when loaded successfully', async () => {
    (api.getContactById as jest.Mock).mockResolvedValueOnce(mockContact);

    render(
      <MemoryRouter>
        <ContactDetails contactId="1" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
      expect(screen.getByText(/\+123456789/i)).toBeInTheDocument();
    });
  });

  it('shows error message when API call fails', async () => {
    (api.getContactById as jest.Mock).mockRejectedValueOnce(new Error('API error'));

    render(
      <MemoryRouter>
        <ContactDetails contactId="error" />
      </MemoryRouter>
    );

    await screen.findByText(/error: api error/i);
  });

  it('shows "not found" message when contact is null', async () => {
    (api.getContactById as jest.Mock).mockResolvedValueOnce(null);

    render(
      <MemoryRouter>
        <ContactDetails contactId="999" />
      </MemoryRouter>
    );

    await screen.findByText(/contact not found/i);
  });
});
