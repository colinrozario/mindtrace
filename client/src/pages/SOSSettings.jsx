import { useState } from 'react';
import { Shield, Phone, Mail, MapPin, AlertCircle, Settings, Plus, X, GripVertical } from 'lucide-react';

const SOSSettings = () => {
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: 'Sarah Johnson', phone: '(555) 123-4567', email: 'sarah.j@email.com', relationship: 'Daughter', priority: 1 },
    { id: 2, name: 'Dr. Michael Chen', phone: '(555) 234-5678', email: 'dr.chen@hospital.com', relationship: 'Doctor', priority: 2 },
    { id: 3, name: 'Maria Garcia', phone: '(555) 345-6789', email: 'maria.g@care.com', relationship: 'Nurse', priority: 3 }
  ]);

  const [autoActions, setAutoActions] = useState({
    sendSMS: true,
    makeCall: true,
    shareLocation: true,
    recordAudio: false,
    emailAlert: true,
    alertServices: false
  });

  const [showAddContactModal, setShowAddContactModal] = useState(false);

  const testSOS = () => {
    alert('SOS Test Mode:\n\nThis would:\n1. Send test SMS to emergency contacts\n2. Show test notification\n3. No actual emergency call made\n\nTest completed successfully!');
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Shield className="h-10 w-10 text-red-600" />
          SOS / Emergency System
        </h1>
        <p className="text-lg text-gray-600">
          Configure emergency response and contacts
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">System Status</h2>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-gray-700 font-medium">System Armed and Ready</span>
            </div>
          </div>
          <button
            onClick={testSOS}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-900 rounded-xl font-medium hover:bg-gray-50 transition-all shadow-lg"
          >
            Test SOS
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Emergency Contacts */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Emergency Contacts
            </h2>
            <button
              onClick={() => setShowAddContactModal(true)}
              className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
              >
                <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-gray-900 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {contact.priority}
                    </span>
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{contact.relationship}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Drag to reorder priority. Contact #1 will be called first in emergency.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Automatic Actions
          </h2>

          <div className="space-y-4">
            {Object.entries(autoActions).map(([key, value]) => {
              const labels = {
                sendSMS: 'Send SMS to all emergency contacts',
                makeCall: 'Make automated call to primary contact',
                shareLocation: 'Share live location',
                recordAudio: 'Record audio/video',
                emailAlert: 'Send email with details',
                alertServices: 'Alert local emergency services'
              };

              return (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-900 font-medium">{labels[key]}</span>
                  <button
                    onClick={() => setAutoActions({ ...autoActions, [key]: !value })}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      value ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      value ? 'translate-x-6' : ''
                    }`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SOS History */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">SOS History</h2>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No SOS events recorded</p>
          <p className="text-sm text-gray-400 mt-2">Emergency activations will appear here</p>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Add Emergency Contact</h2>
              <button
                onClick={() => setShowAddContactModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <input
                type="text"
                placeholder="Relationship"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowAddContactModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddContactModal(false);
                  alert('Emergency contact added!');
                }}
                className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800"
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOSSettings;
