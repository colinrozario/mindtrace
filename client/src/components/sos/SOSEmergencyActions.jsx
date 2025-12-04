import { CheckCircle, Phone, Navigation, PhoneCall, AlertTriangle } from 'lucide-react';
import { getDirectionsUrl } from '../../utils/geocoding';

/**
 * @param {Object} props
 * @param {import('../../types/sos.types').SOSAlert} [props.activeAlert]
 * @param {import('../../types/sos.types').Location} [props.location]
 * @param {Function} props.onResolve
 * @param {Function} props.onAcknowledge
 * @param {boolean} [props.isTest]
 */
const SOSEmergencyActions = ({
    activeAlert,
    location,
    onResolve,
    onAcknowledge,
    isTest = false,
    contacts = []
}) => {
    const handleCallEmergency = () => {
        // In production, this would call local emergency services
        // For India: 112 (unified emergency) or 100 (police)
        window.location.href = 'tel:112';
    };

    const handleCallWearer = () => {
        // This would call the wearer's glasses
        // For demo, we just show an alert
        alert('Calling wearer\'s glasses... (Demo mode)');
    };

    const handleGetDirections = () => {
        if (location) {
            window.open(getDirectionsUrl(location.lat, location.lng), '_blank');
        }
    };

    const handleResolve = () => {
        if (activeAlert) {
            onResolve(activeAlert.id, 'Caregiver', isTest ? 'Test alert resolved' : '');
        }
    };

    const handleAcknowledge = () => {
        if (activeAlert) {
            onAcknowledge(activeAlert.id);
        }
    };

    if (!activeAlert) {
        return null;
    }

    const isAcknowledged = activeAlert.status === 'acknowledged';

    return (
        <div className="space-y-3">
            {/* Primary Actions */}
            <div className="grid grid-cols-2 gap-3">
                {!isAcknowledged && (
                    <button
                        onClick={handleAcknowledge}
                        className="flex items-center justify-center gap-2 p-3 
              bg-amber-100 hover:bg-amber-200 border-2 border-amber-300
              rounded-xl transition-all font-medium text-amber-800
              focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                        aria-label="Acknowledge this SOS alert"
                    >
                        <AlertTriangle className="h-5 w-5" />
                        <span>Acknowledge</span>
                    </button>
                )}

                <button
                    onClick={handleResolve}
                    className={`flex items-center justify-center gap-2 p-3 
            bg-emerald-500 hover:bg-emerald-600 
            rounded-xl transition-all font-medium text-white
            focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2
            ${!isAcknowledged ? 'col-span-1' : 'col-span-2'}`}
                    aria-label="Mark this SOS alert as resolved"
                >
                    <CheckCircle className="h-5 w-5" />
                    <span>Mark Resolved</span>
                </button>
            </div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-3 gap-2">
                <button
                    onClick={handleCallEmergency}
                    className="flex flex-col items-center gap-1.5 p-3 
            bg-red-50 hover:bg-red-100 border border-red-200
            rounded-xl transition-all
            focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                    aria-label="Call emergency services"
                >
                    <Phone className="h-5 w-5 text-red-600" />
                    <span className="text-xs font-medium text-red-700">Emergency</span>
                </button>

                <button
                    onClick={handleCallWearer}
                    className="flex flex-col items-center gap-1.5 p-3 
            bg-blue-50 hover:bg-blue-100 border border-blue-200
            rounded-xl transition-all
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                    aria-label="Call wearer's glasses"
                >
                    <PhoneCall className="h-5 w-5 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">Call Wearer</span>
                </button>

                {contacts.map((contact) => (
                    <a
                        key={contact.id}
                        href={`tel:${contact.phone}`}
                        className="flex flex-col items-center gap-1.5 p-3 
                bg-emerald-50 hover:bg-emerald-100 border border-emerald-200
                rounded-xl transition-all
                focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                        aria-label={`Call ${contact.name}`}
                    >
                        <PhoneCall className="h-5 w-5 text-emerald-600" />
                        <span className="text-xs font-medium text-emerald-700 truncate w-full text-center">
                            {contact.name.split(' ')[0]}
                        </span>
                    </a>
                ))}

                <button
                    onClick={handleGetDirections}
                    disabled={!location}
                    className="flex flex-col items-center gap-1.5 p-3 
            bg-indigo-50 hover:bg-indigo-100 border border-indigo-200
            rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                    aria-label="Get directions to location"
                >
                    <Navigation className="h-5 w-5 text-indigo-600" />
                    <span className="text-xs font-medium text-indigo-700">Directions</span>
                </button>
            </div>

            {/* Test Mode Indicator */}
            {isTest && (
                <div className="p-2 bg-purple-50 border border-purple-200 rounded-lg text-center">
                    <span className="text-xs font-medium text-purple-700">
                        🧪 This is a TEST alert
                    </span>
                </div>
            )}
        </div>
    );
};

export default SOSEmergencyActions;
