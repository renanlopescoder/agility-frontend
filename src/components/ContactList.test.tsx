/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ContactList } from './ContactList';
import * as api from '../api/contacts';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../api/contacts');

describe('ContactList', () => {
  const mockContacts = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+111111111',
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '+222222222',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state', async () => {
    (api.getAllContacts as jest.Mock).mockResolvedValueOnce(mockContacts);

    render(
      <MemoryRouter>
        <ContactList />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading contacts/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByText(/loading contacts/i)).not.toBeInTheDocument()
    );
  });

  it('renders contact items when data is loaded', async () => {
    (api.getAllContacts as jest.Mock).mockResolvedValueOnce(mockContacts);

    render(
      <MemoryRouter>
        <ContactList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/alice johnson/i)).toBeInTheDocument();
      expect(screen.getByText(/bob smith/i)).toBeInTheDocument();
    });
  });

  it('shows error message on fetch failure', async () => {
    (api.getAllContacts as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter>
        <ContactList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/error: network error/i)).toBeInTheDocument();
    });
  });

  it('shows message when no contacts are found', async () => {
    (api.getAllContacts as jest.Mock).mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <ContactList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no contacts found/i)).toBeInTheDocument();
    });
  });

  it('calls deleteContact when delete button is clicked and confirmed', async () => {
    jest.spyOn(window, 'confirm').mockReturnValueOnce(true);
    (api.getAllContacts as jest.Mock)
      .mockResolvedValueOnce(mockContacts) // initial load
      .mockResolvedValueOnce([mockContacts[1]]); // after deletion
    (api.deleteContact as jest.Mock).mockResolvedValueOnce(undefined);

    render(
      <MemoryRouter>
        <ContactList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/alice johnson/i)).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByTitle(/delete contact/i)[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(api.deleteContact).toHaveBeenCalledWith('1');
      expect(screen.queryByText(/alice johnson/i)).not.toBeInTheDocument();
    });
  });
});
