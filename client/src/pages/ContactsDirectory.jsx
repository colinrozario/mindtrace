import { useState } from 'react';
import { Search, Grid, List, Plus, Eye } from 'lucide-react';
import AddContactModal from '../components/AddContactModal';
import ContactDetailModal from '../components/ContactDetailModal';
import EditContactModal from '../components/EditContactModal';

const ContactsDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedRelationship, setSelectedRelationship] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      relationship: 'family',
      relationshipDetail: 'Daughter',
      avatar: 'SJ',
      color: 'indigo',
      photos: [],
      notes: 'Visits every Sunday. Primary caregiver. Works as a nurse at City Hospital.',
      phoneNumber: '(555) 123-4567',
      email: 'sarah.j@email.com',
      visitFrequency: 'Weekly',
      lastSeen: '2025-12-03T10:30:00',
      totalInteractions: 47,
      isActive: true
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      relationship: 'doctor',
      relationshipDetail: 'Neurologist',
      avatar: 'MC',
      color: 'blue',
      photos: [],
      notes: 'Neurologist at City Hospital. Appointments every 2 weeks. Very patient and thorough.',
      phoneNumber: '(555) 234-5678',
      email: 'dr.chen@cityhospital.com',
      visitFrequency: 'Bi-weekly',
      lastSeen: '2025-12-02T14:00:00',
      totalInteractions: 24,
      isActive: true
    },
    {
      id: 3,
      name: 'Maria Garcia',
      relationship: 'caretaker',
      relationshipDetail: 'Home Care Nurse',
      avatar: 'MG',
      color: 'emerald',
      photos: [],
      notes: 'Home care nurse. Mon/Wed/Fri mornings. Very reliable and caring.',
      phoneNumber: '(555) 345-6789',
      email: 'maria.garcia@homecare.com',
      visitFrequency: '3x per week',
      lastSeen: '2025-12-03T08:00:00',
      totalInteractions: 89,
      isActive: true
    },
    {
      id: 4,
      name: 'Tommy Johnson',
      relationship: 'family',
      relationshipDetail: 'Grandson',
      avatar: 'TJ',
      color: 'purple',
      photos: [],
      notes: "Sarah's son. 12 years old. Loves talking about video games and dinosaurs.",
      phoneNumber: '',
      email: '',
      visitFrequency: 'Weekly',
      lastSeen: '2025-11-30T16:45:00',
      totalInteractions: 31,
      isActive: true
    },
    {
      id: 5,
      name: 'Robert Miller',
      relationship: 'friend',
      relationshipDetail: 'Neighbor',
      avatar: 'RM',
      color: 'yellow',
      photos: [],
      notes: 'Neighbor from 42B. Plays chess on Thursdays. Known each other for 15 years.',
      phoneNumber: '(555) 456-7890',
      email: 'robert.m@email.com',
      visitFrequency: 'Weekly',
      lastSeen: '2025-11-28T14:00:00',
      totalInteractions: 156,
      isActive: true
    },
    {
      id: 6,
      name: 'Emily Watson',
      relationship: 'caretaker',
      relationshipDetail: 'Evening Caretaker',
      avatar: 'EW',
      color: 'pink',
      photos: [],
      notes: 'Evening shift caretaker. 6 PM - 10 PM. Helps with dinner and evening routine.',
      phoneNumber: '(555) 567-8901',
      email: 'emily.w@homecare.com',
      visitFrequency: 'Daily',
      lastSeen: '2025-12-02T18:00:00',
      totalInteractions: 62,
      isActive: true
    }
  ]);

  const relationshipTypes = [
    { value: 'all', label: 'All Contacts' },
    { value: 'family', label: 'Family' },
    { value: 'friend', label: 'Friends' },
    { value: 'caretaker', label: 'Caretakers' },
    { value: 'doctor', label: 'Medical' },
    { value: 'nurse', label: 'Nurses' },
    { value: 'neighbor', label: 'Neighbors' },
  ];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.relationshipDetail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRelationship = selectedRelationship === 'all' || contact.relationship === selectedRelationship;

    return matchesSearch && matchesRelationship;
  });

  const formatLastSeen = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays}d ago`;
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Contacts Directory
          </h1>
          <p className="text-lg text-gray-600">
            Manage people in the recognition database
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800
            transition-all duration-200 flex items-center gap-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Add Contact
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or relationship..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
                transition-all duration-200"
            />
          </div>

          {/* Relationship Filter */}
          <select
            value={selectedRelationship}
            onChange={(e) => setSelectedRelationship(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
              transition-all duration-200 cursor-pointer"
          >
            {relationshipTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex gap-2 bg-gray-50 rounded-xl p-1 border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Contacts Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => {
                setSelectedContact(contact);
                setShowDetailModal(true);
              }}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg
                transition-all duration-300 cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center mb-4">
                <div className={`w-20 h-20 rounded-full bg-linear-to-br from-${contact.color}-400 to-${contact.color}-600 flex items-center justify-center text-white font-semibold text-2xl mb-4`}>
                  {contact.avatar}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {contact.name}
                </h3>
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg mt-2">
                  {contact.relationshipDetail}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Last seen:</span>
                  <span className="font-medium text-gray-900">{formatLastSeen(contact.lastSeen)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interactions:</span>
                  <span className="font-medium text-gray-900">{contact.totalInteractions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frequency:</span>
                  <span className="font-medium text-gray-900">{contact.visitFrequency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => {
                setSelectedContact(contact);
                setShowDetailModal(true);
              }}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg
                transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full bg-linear-to-br from-${contact.color}-400 to-${contact.color}-600 flex items-center justify-center text-white font-semibold text-lg shrink-0`}>
                  {contact.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {contact.name}
                  </h3>
                  <p className="text-sm text-gray-500">{contact.relationshipDetail}</p>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Last Seen</p>
                    <p className="font-medium text-gray-900">{formatLastSeen(contact.lastSeen)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Interactions</p>
                    <p className="font-medium text-gray-900">{contact.totalInteractions}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Frequency</p>
                    <p className="font-medium text-gray-900">{contact.visitFrequency}</p>
                  </div>
                </div>
                <Eye className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredContacts.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">No contacts found matching your filters</p>
        </div>
      )}

      {/* Modals */}
      {showAddModal && <AddContactModal isOpen={true} onClose={() => setShowAddModal(false)} />}
      {showDetailModal && selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedContact(null);
          }}
          onEdit={(contact) => {
            setShowDetailModal(false);
            setShowEditModal(true);
          }}
        />
      )}
      {showEditModal && selectedContact && (
        <EditContactModal
          isOpen={true}
          contact={selectedContact}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updatedContact) => {
            setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
            setShowEditModal(false);
            // Optionally reopen detail modal or just stay on list
            // For now, let's just close
          }}
        />
      )}
    </div>
  );
};

export default ContactsDirectory;
