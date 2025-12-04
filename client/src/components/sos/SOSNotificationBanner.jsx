/**
 * SOSNotificationBanner Component
 * Slide-in notification banner for SOS alerts
 */

import { useState, useEffect } from 'react';
import { AlertTriangle, X, Volume2, VolumeX } from 'lucide-react';

/**
 * @param {Object} props
 * @param {boolean} props.show - Whether to show the banner
 * @param {string} props.message - Alert message
 * @param {Function} props.onDismiss - Dismiss callback
 * @param {boolean} [props.soundEnabled] - Whether sound is enabled
 * @param {Function} [props.onToggleSound] - Toggle sound callback
 * @param {boolean} [props.isTest] - Whether this is a test notification
 */
const SOSNotificationBanner = ({
    show,
    message,
    onDismiss,
    soundEnabled = true,
    onToggleSound,
    isTest = false
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Handle show/hide animation
    useEffect(() => {
        if (show) {
            setIsAnimating(true);
            // Small delay before showing for animation
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 50);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            // Wait for animation to complete before removing
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [show]);

    if (!isAnimating && !show) {
        return null;
    }

    return (
        <div
            className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
            role="alert"
            aria-live="assertive"
        >
            <div className={`mx-auto max-w-4xl m-4 ${isTest ? 'bg-purple-600' : 'bg-amber-500'
                } rounded-xl shadow-2xl overflow-hidden`}>
                <div className="p-4 flex items-center gap-4">
                    {/* Pulsing Icon */}
                    <div className={`p-2 ${isTest ? 'bg-purple-500' : 'bg-amber-400'} rounded-lg relative`}>
                        <AlertTriangle className="h-6 w-6 text-white" />
                        <span className={`absolute inset-0 rounded-lg ${isTest ? 'bg-purple-400' : 'bg-amber-300'
                            } animate-ping opacity-75`} />
                    </div>

                    {/* Message */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white">
                                {isTest ? '🧪 Test Alert' : '🚨 SOS Alert'}
                            </h4>
                            {isTest && (
                                <span className="px-2 py-0.5 bg-purple-700 text-purple-200 text-xs font-medium rounded-full">
                                    TEST MODE
                                </span>
                            )}
                        </div>
                        <p className="text-white/90 text-sm mt-0.5">{message}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {onToggleSound && (
                            <button
                                onClick={onToggleSound}
                                className={`p-2 rounded-lg transition-colors ${isTest
                                        ? 'hover:bg-purple-500 text-white'
                                        : 'hover:bg-amber-400 text-white'
                                    }`}
                                aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
                            >
                                {soundEnabled ? (
                                    <Volume2 className="h-5 w-5" />
                                ) : (
                                    <VolumeX className="h-5 w-5" />
                                )}
                            </button>
                        )}

                        <button
                            onClick={onDismiss}
                            className={`p-2 rounded-lg transition-colors ${isTest
                                    ? 'hover:bg-purple-500 text-white'
                                    : 'hover:bg-amber-400 text-white'
                                }`}
                            aria-label="Dismiss notification"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Progress Bar (auto-dismiss indicator would go here) */}
                <div className={`h-1 ${isTest ? 'bg-purple-700' : 'bg-amber-600'}`}>
                    <div className={`h-full ${isTest ? 'bg-purple-400' : 'bg-amber-300'}`}
                        style={{ width: '100%' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SOSNotificationBanner;
