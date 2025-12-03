import { useState, useEffect } from 'react';
import { AlertCircle, Plus, Trash2, Shield, Phone, MessageSquare, Bell } from 'lucide-react';
import { sosApi } from '../services/api';
import toast from 'react-hot-toast';

const SOSSettings = () => {
  const [contacts, setContacts] = useState([]);
  const [config, setConfig] = useState({
    auto_call_emergency: false,
    notify_all_contacts: true,
    sound_alarm: true,
    share_location: true
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [contactsRes, configRes] = await Promise.all([
        sosApi.getContacts(),
        sosApi.getConfig()
      ]);
      setContacts(contactsRes.data);
      setConfig(configRes.data);
    } catch (error) {
      console.error("Error fetching SOS settings:", error);
      toast.error("Failed to load SOS settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfigChange = async (key) => {
    const newConfig = { ...config, [key]: !config[key] };
    // Optimistic update
    setConfig(newConfig);
    try {
      await sosApi.updateConfig(newConfig);
      toast.success("Settings updated");
    } catch (error) {
      console.error("Error updating config:", error);
      toast.error("Failed to update settings");
      // Revert on error
      setConfig(config);
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      await sosApi.createContact({ ...newContact, priority: contacts.length + 1 });
      toast.success("Emergency contact added");
      setShowAddModal(false);
      setNewContact({ name: '', phone: '', relationship: '' });
      fetchData();
    } catch (error) {
      console.error("Error adding contact:", error);
      toast.error("Failed to add contact");
    }
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm('Remove this emergency contact?')) {
      try {
        await sosApi.deleteContact(id);
        setContacts(contacts.filter(c => c.id !== id));
        toast.success("Contact removed");
      } catch (error) {
        console.error("Error deleting contact:", error);
        toast.error("Failed to remove contact");
      }
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          SOS Settings
        </h1>
        <p className="text-lg text-gray-600">
          Configure emergency protocols and contacts
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Emergency Contacts */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Phone className="h-5 w-5 text-red-500" />
                Emergency Contacts
              </h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            <div className="space-y-3">
              {loading ? (
                <p className="text-gray-500 text-center py-4">Loading contacts...</p>
              ) : contacts.length > 0 ? (
                contacts.map((contact, index) => (
                  <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                        <p className="text-sm text-gray-500">{contact.relationship} • {contact.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No emergency contacts added</p>
              )}
            </div>
          </div>

          {/* Add Contact Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Add Emergency Contact</h3>
                <form onSubmit={handleAddContact} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={newContact.name}
                      onChange={e => setNewContact({...newContact, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                    <input
                      type="text"
                      required
                      value={newContact.relationship}
                      onChange={e => setNewContact({...newContact, relationship: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={newContact.phone}
                      onChange={e => setNewContact({...newContact, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Add Contact
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Automatic Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-500" />
              Automatic Actions
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <Phone className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Call Emergency Services</h3>
                    <p className="text-sm text-gray-500">Automatically call 911 if no response from contacts</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={config.auto_call_emergency}
                    onChange={() => handleConfigChange('auto_call_emergency')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Notify All Contacts</h3>
                    <p className="text-sm text-gray-500">Send SMS alert to all emergency contacts</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={config.notify_all_contacts}
                    onChange={() => handleConfigChange('notify_all_contacts')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <Bell className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Sound Alarm</h3>
                    <p className="text-sm text-gray-500">Play loud alarm on smart glasses</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={config.sound_alarm}
                    onChange={() => handleConfigChange('sound_alarm')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
            <div className="flex gap-4">
              <AlertCircle className="h-6 w-6 text-red-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Emergency Protocol</h3>
                <p className="text-sm text-red-700 leading-relaxed">
                  When SOS is triggered, the system will first attempt to contact the primary caregiver. 
                  If no response within 60 seconds, it will proceed to notify all emergency contacts 
                  and share the current location.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOSSettings;
