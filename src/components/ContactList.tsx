import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllContacts, deleteContact, Contact } from '../api/contacts';

export const ContactList = () => {
  const [data, setData] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    try {
      const contacts = await getAllContacts();
      setData(contacts);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (contact: Contact, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const confirmed = window.confirm(`Are you sure you want to delete ${contact.name}?`);
    if (!confirmed) return;

    setDeletingIds(prev => new Set(prev).add(contact.id));
    try {
      await deleteContact(contact.id);
      await fetchData(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to delete contact');
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(contact.id);
        return newSet;
      });
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

  if (loading) return <div className="loading">Loading contacts...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!data || data.length === 0) return <div className="loading">No contacts found.</div>;

  return (
    <div className="fade-in">
      <div className="contact-list-header">
        <h2 className="page-title">All Contacts</h2>
        <Link to="/contacts/create" className="btn btn-success">
          Create Contact
        </Link>
      </div>
      
      <div className="contact-list">
        {data.map((contact) => (
          <div key={contact.id} className="contact-item">
            <div className="contact-avatar">
              {getInitials(contact.name)}
            </div>
            
            <Link
              to={`/contacts/${contact.id}`}
              className="contact-info"
            >
              <div className="contact-name">{contact.name}</div>
              <div className="contact-details">
                <div className="contact-email">{contact.email}</div>
                <div className="contact-phone">{contact.phone}</div>
              </div>
            </Link>
            
            <div className="contact-actions">
              <button
                onClick={(e) => handleDelete(contact, e)}
                disabled={deletingIds.has(contact.id)}
                className="btn btn-danger btn-sm btn-icon"
                title="Delete contact"
              >
                {deletingIds.has(contact.id) ? '...' : '×'}
              </button>
              <span className="contact-chevron">›</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
