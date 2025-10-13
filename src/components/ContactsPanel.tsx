import { useState, useEffect } from 'react';
import { Search, Mail, FileText, Calendar, User, Phone, Building } from 'lucide-react';
import { emailService } from '../services/emailService';
import { Contact, Email } from '../types/email';
import { mockQuotes, mockMeetings } from '../data/mockData';

interface ContactsPanelProps {
  onSelectContact: (contact: Contact) => void;
  onSendEmail: (contactEmail: string) => void;
  selectedContactId?: string | null;
}

export function ContactsPanel({ onSelectContact, onSendEmail, selectedContactId }: ContactsPanelProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactEmails, setContactEmails] = useState<Email[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (selectedContactId) {
      const contact = contacts.find(c => c.id === selectedContactId);
      if (contact) {
        handleSelectContact(contact);
      }
    }
  }, [selectedContactId, contacts]);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const data = await emailService.getContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectContact = async (contact: Contact) => {
    setSelectedContact(contact);
    onSelectContact(contact);

    try {
      const emails = await emailService.getEmailsByContact(contact.id);
      setContactEmails(emails);
    } catch (error) {
      console.error('Error loading contact emails:', error);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const query = searchQuery.toLowerCase();
    return (
      contact.email.toLowerCase().includes(query) ||
      contact.first_name?.toLowerCase().includes(query) ||
      contact.last_name?.toLowerCase().includes(query) ||
      contact.company_name?.toLowerCase().includes(query)
    );
  });

  const getContactQuotes = () => {
    if (!selectedContact) return [];
    return mockQuotes.filter(q =>
      q.companyNames.some(name =>
        name.toLowerCase() === selectedContact.company_name?.toLowerCase()
      )
    );
  };

  const getContactMeetings = () => {
    const contactQuotes = getContactQuotes();
    const quoteIds = contactQuotes.map(q => q.id);
    return mockMeetings.filter(m => quoteIds.includes(m.quoteId));
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Contacts</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Loading contacts...
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No contacts found
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredContacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => handleSelectContact(contact)}
                className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  selectedContact?.id === contact.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {contact.first_name} {contact.last_name}
                    </p>
                    {contact.company_name && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {contact.company_name}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500 truncate mt-1">
                      {contact.email}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedContact && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Contact Details</h4>
            <div className="space-y-2">
              {selectedContact.phone && (
                <div className="flex items-center gap-2 text-xs">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{selectedContact.phone}</span>
                </div>
              )}
              {selectedContact.position && (
                <div className="flex items-center gap-2 text-xs">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{selectedContact.position}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Quick Stats</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 text-center">
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <p className="text-xs font-bold text-gray-900 dark:text-white">{contactEmails.length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Emails</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 text-center">
                <FileText className="w-4 h-4 text-green-600 dark:text-green-400 mx-auto mb-1" />
                <p className="text-xs font-bold text-gray-900 dark:text-white">{getContactQuotes().length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Quotes</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 text-center">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                <p className="text-xs font-bold text-gray-900 dark:text-white">{getContactMeetings().length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Meetings</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onSendEmail(selectedContact.email)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              <Mail className="w-4 h-4" />
              Send Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
