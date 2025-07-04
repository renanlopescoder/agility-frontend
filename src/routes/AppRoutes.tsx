import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ContactList } from '../components/ContactList';
import { ContactDetails } from '../components/ContactDetails';
import { CreateContact } from '../components/CreateContact';
import { useParams } from 'react-router-dom';

const ContactDetailsWrapper = () => {
  const { id } = useParams();
  return id ? <ContactDetails contactId={id} /> : <p>Invalid contact ID</p>;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ContactList />} />
      <Route path="/contacts/create" element={<CreateContact />} />
      <Route path="/contacts/:id" element={<ContactDetailsWrapper />} />
    </Routes>
  );
};
