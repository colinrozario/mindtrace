/**
 * SOSQuickInfo Component
 * Displays wearer profile, emergency contacts, and status
 */

import { Phone, MessageSquare, AlertCircle } from 'lucide-react';
import SOSStatusIndicator from './SOSStatusIndicator';

/**
 * @param {Object} props
 * @param {import('../../types/sos.types').WearerProfile} props.wearer
 * @param {import('../../types/sos.types').EmergencyContact[]} props.contacts
 * @param {number} props.batteryLevel
 * @param {'online' | 'offline'} props.connectionStatus
 * @param {string} props.lastSeen
 * @param {boolean} [props.isStale]
 */
const SOSQuickInfo = ({
    wearer,
    contacts,
    batteryLevel,
    connectionStatus,
    lastSeen,
    isStale = false
}) => {
    const handleCall = (phone) => {
        window.location.href = `tel:${phone.replace(/\s/g, '')}`;
    };

    const handleMessage = (phone) => {
        window.location.href = `sms:${phone.replace(/\s/g, '')}`;
    };

    return (
        <div className="space-y-4">
            {/* Wearer Profile */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Wearer
                </h3>

                <div className="flex items-center gap-4 mb-4">
                    {wearer.photoUrl ? (
                        <img
                            src={wearer.photoUrl}
                            alt={wearer.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                        />
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 
              flex items-center justify-center text-white text-lg font-bold">
                            {wearer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                    )}
                    <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{wearer.name}</h4>
                        <p className="text-sm text-gray-500">
                            Last seen: {lastSeen}
                        </p>
                    </div>
                </div>

                {/* Status */}
                <SOSStatusIndicator
                    batteryLevel={batteryLevel}
                    connectionStatus={connectionStatus}
                    lastSeen={lastSeen}
                    isStale={isStale}
                />
            </div>

            {/* Emergency Contacts */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Emergency Contacts
                </h3>

                <div className="space-y-3">
                    {contacts.map((contact, index) => (
                        <div
                            key={contact.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl 
                border border-gray-100 hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 
                  flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{contact.name}</p>
                                    <p className="text-xs text-gray-500">{contact.relationship}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleCall(contact.phone)}
                                    className="p-2 bg-emerald-100 hover:bg-emerald-200 rounded-lg 
                    transition-colors group"
                                    aria-label={`Call ${contact.name}`}
                                    title="Call"
                                >
                                    <Phone className="h-4 w-4 text-emerald-600 group-hover:text-emerald-700" />
                                </button>
                                <button
                                    onClick={() => handleMessage(contact.phone)}
                                    className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg 
                    transition-colors group"
                                    aria-label={`Message ${contact.name}`}
                                    title="Message"
                                >
                                    <MessageSquare className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {contacts.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No emergency contacts configured</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SOSQuickInfo;
