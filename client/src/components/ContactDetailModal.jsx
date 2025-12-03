import { X, Phone, Mail, Edit2, Trash2 } from 'lucide-react';

const ContactDetailModal = ({ contact, onClose, onEdit }) => {
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

  const handleEdit = () => {
    if (onEdit) {
      onEdit(contact);
    }
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      console.log('Delete contact:', contact);
      onClose();
      alert('Contact deleted successfully!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full bg-linear-to-br from-${contact.color}-400 to-${contact.color}-600 flex items-center justify-center text-white font-semibold text-xl`}
            >
              {contact.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{contact.name}</h2>
              <p className="text-gray-500">{contact.relationshipDetail}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Last Seen</p>
              <p className="font-semibold text-gray-900">{formatLastSeen(contact.lastSeen)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Total Interactions</p>
              <p className="font-semibold text-gray-900">{contact.totalInteractions}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Visit Frequency</p>
              <p className="font-semibold text-gray-900">{contact.visitFrequency}</p>
            </div>

          </div>

          {/* Contact Information */}
          {(contact.phoneNumber || contact.email) && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-3">
                {contact.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{contact.phoneNumber}</span>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{contact.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {contact.notes && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Notes</h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4">
                {contact.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleEdit}
            className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <Edit2 className="h-5 w-5" />
            Edit Contact
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-3 border border-red-300 text-red-700 rounded-xl font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <Trash2 className="h-5 w-5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailModal;
