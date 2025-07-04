import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getContactById, deleteContact, Contact } from '../api/contacts';

interface Props {
  contactId: string;
}

export const ContactDetails: React.FC<Props> = ({ contactId }) => {
  const [data, setData] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contact = await getContactById(contactId);
        setData(contact);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contactId]);

  const handleDelete = async () => {
    if (!data) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete ${data.name}?`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteContact(contactId);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to delete contact');
      setDeleting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) return <div className="loading">Loading contact details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!data) return <div className="loading">Contact not found.</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <Link to="/" className="nav-back">
          <span className='arrow'>&lt;</span> Back to Contacts
        </Link>
        <h1 className="page-title">Contact Details</h1>
      </div>
      
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-center gap-2">
            <div className="contact-avatar">
              {getInitials(data.name)}
            </div>
            <div>
              <h2 className="card-title">{data.name}</h2>
              <p className="page-subtitle">Contact Information</p>
            </div>
          </div>
        </div>
        
        <div className="card-content">
          <div className="card-field">
            <span className="card-field-label">ID:</span>
            <span className="card-field-value">{data.id}</span>
          </div>
          
          <div className="card-field">
            <span className="card-field-label">Name:</span>
            <span className="card-field-value">{data.name}</span>
          </div>
          
          <div className="card-field">
            <span className="card-field-label">Email:</span>
            <span className="card-field-value">
              <a href={`mailto:${data.email}`}>
                {data.email}
              </a>
            </span>
          </div>
          
          <div className="card-field">
            <span className="card-field-label">Phone:</span>
            <span className="card-field-value">
              <a href={`tel:${data.phone}`}>
                {data.phone}
              </a>
            </span>
          </div>
        </div>
        
        <div className="card-actions">
          <Link to="/" className="btn btn-secondary">
            Back to List
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn btn-danger"
          >
            {deleting ? 'Deleting...' : 'Delete Contact'}
          </button>
        </div>
      </div>
    </div>
  );
};
