/**
 * SOSTestControls Component
 * Test controls for simulating SOS alerts during development
 */

import { useState } from 'react';
import { FlaskConical, MapPin, Trash2, ChevronDown, ChevronUp, Volume2, VolumeX } from 'lucide-react';

/**
 * @param {Object} props
 * @param {Function} props.onSimulateSOS - Trigger a test SOS alert
 * @param {Function} props.onRandomLocation - Set random location
 * @param {Function} props.onClearHistory - Clear alert history
 * @param {Function} props.onTestSound - Play test sound
 * @param {boolean} [props.isAlertActive] - Whether an alert is currently active
 * @param {boolean} [props.soundEnabled] - Whether sound is enabled
 * @param {Function} [props.onToggleSound] - Toggle sound preference
 */
const SOSTestControls = ({
    onSimulateSOS,
    onRandomLocation,
    onClearHistory,
    onTestSound,
    isAlertActive = false,
    soundEnabled = true,
    onToggleSound
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-purple-50 rounded-2xl border-2 border-purple-200 overflow-hidden">
            {/* Header - Collapsible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-purple-100 transition-colors"
                aria-expanded={isExpanded}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <FlaskConical className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-purple-900">Test Controls</h3>
                        <p className="text-xs text-purple-600">Development & Testing Mode</p>
                    </div>
                </div>

                {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-purple-500" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-purple-500" />
                )}
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="p-4 pt-2 border-t border-purple-200 bg-purple-50/50">
                    {/* Warning Notice */}
                    <div className="p-3 bg-purple-100 rounded-lg mb-4">
                        <p className="text-xs text-purple-700">
                            ⚠️ These controls are for testing purposes only.
                            They simulate SOS events without triggering actual alerts.
                        </p>
                    </div>

                    {/* Test Buttons */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <button
                            onClick={onSimulateSOS}
                            disabled={isAlertActive}
                            className="flex items-center justify-center gap-2 p-3 
                bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300
                text-white font-medium rounded-xl transition-colors
                disabled:cursor-not-allowed"
                        >
                            <FlaskConical className="h-4 w-4" />
                            <span className="text-sm">Simulate SOS</span>
                        </button>

                        <button
                            onClick={onRandomLocation}
                            className="flex items-center justify-center gap-2 p-3 
                bg-indigo-500 hover:bg-indigo-600 
                text-white font-medium rounded-xl transition-colors"
                        >
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">Random Location</span>
                        </button>
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onTestSound}
                            className="flex items-center gap-2 px-3 py-2 
                bg-white border border-purple-200 hover:bg-purple-100
                text-purple-700 text-sm font-medium rounded-lg transition-colors"
                        >
                            <Volume2 className="h-4 w-4" />
                            Test Sound
                        </button>

                        {onToggleSound && (
                            <button
                                onClick={onToggleSound}
                                className={`flex items-center gap-2 px-3 py-2 
                  border text-sm font-medium rounded-lg transition-colors ${soundEnabled
                                        ? 'bg-emerald-100 border-emerald-200 text-emerald-700'
                                        : 'bg-gray-100 border-gray-200 text-gray-600'
                                    }`}
                            >
                                {soundEnabled ? (
                                    <Volume2 className="h-4 w-4" />
                                ) : (
                                    <VolumeX className="h-4 w-4" />
                                )}
                                Sound {soundEnabled ? 'On' : 'Off'}
                            </button>
                        )}

                        <button
                            onClick={onClearHistory}
                            className="flex items-center gap-2 px-3 py-2 
                bg-white border border-red-200 hover:bg-red-50
                text-red-600 text-sm font-medium rounded-lg transition-colors ml-auto"
                        >
                            <Trash2 className="h-4 w-4" />
                            Clear History
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SOSTestControls;
