/**
 * SOSPage Component
 * Main SOS Alert Dashboard page
 */

import { useEffect } from 'react';
import { Shield, Bell } from 'lucide-react';

// Components
import SOSMap from './SOSMap';
import SOSQuickInfo from './SOSQuickInfo';
import SOSAlertPanel from './SOSAlertPanel';
import SOSAlertHistory from './SOSAlertHistory';
import SOSTestControls from './SOSTestControls';
import SOSNotificationBanner from './SOSNotificationBanner';

// Hooks
import useSOSAlerts from '../../hooks/useSOSAlerts';
import useLocationTracking from '../../hooks/useLocationTracking';
import useNotifications from '../../hooks/useNotifications';

// Config
import {
    DEFAULT_WEARER_PROFILE,
    DEFAULT_EMERGENCY_CONTACTS
} from '../../constants/sosConfig';

const SOSPage = () => {
    // SOS Alert state
    const {
        activeAlert,
        alertHistory,
        isLoading,
        isTestMode,
        triggerAlert,
        acknowledgeAlert,
        resolveAlert,
        clearHistory,
        updateAlertLocation
    } = useSOSAlerts();

    // Location tracking with real-time polling
    const {
        currentLocation,
        batteryLevel,
        connectionStatus,
        isStale,
        setRandomLocation,
        getTimeSinceUpdate
    } = useLocationTracking({ enablePolling: true, pollInterval: 3000 });

    // Notifications
    const {
        preferences,
        showBanner,
        bannerMessage,
        togglePreference,
        hideNotificationBanner,
        triggerSOSNotification,
        playTestSound
    } = useNotifications();

    // Handle SOS simulation
    const handleSimulateSOS = async () => {
        const alert = await triggerAlert({ isTest: true });
        if (alert) {
            triggerSOSNotification(
                `SOS Alert received at ${alert.location?.address || 'Unknown location'}`,
                alert.location
            );
        }
    };

    // Handle random location
    const handleRandomLocation = () => {
        const newLocation = setRandomLocation();
        if (activeAlert) {
            updateAlertLocation(newLocation);
        }
    };

    // Handle resolve
    const handleResolve = (alertId, resolvedBy, notes) => {
        resolveAlert(alertId, resolvedBy, notes);
        hideNotificationBanner();
    };

    // Get overall status
    const getOverallStatus = () => {
        if (activeAlert) {
            if (activeAlert.status === 'pending') {
                return { label: 'SOS Active', color: 'bg-amber-500', pulse: true };
            }
            return { label: 'Acknowledged', color: 'bg-blue-500', pulse: false };
        }
        return { label: 'All Safe', color: 'bg-emerald-500', pulse: false };
    };

    const status = getOverallStatus();

    if (isLoading) {
        return (
            <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="mt-4 text-gray-600">Loading SOS Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
            {/* Notification Banner */}
            <SOSNotificationBanner
                show={showBanner}
                message={bannerMessage}
                onDismiss={hideNotificationBanner}
                soundEnabled={preferences.sound}
                onToggleSound={() => togglePreference('sound')}
                isTest={isTestMode}
            />

            {/* Page Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <Shield className="h-8 w-8 text-indigo-600" />
                        SOS Alert Center
                    </h1>
                    <p className="text-lg text-gray-600">
                        Real-time location tracking and emergency response
                    </p>
                </div>

                {/* Status Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold ${status.color}`}>
                    {status.pulse && (
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                    )}
                    <span>{status.label}</span>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
                {/* Map - Takes 2 columns on large screens */}
                <div className="lg:col-span-2">
                    <SOSMap
                        location={activeAlert?.location || currentLocation}
                        isAlertActive={!!activeAlert}
                        showAccuracy={true}
                    />
                </div>

                {/* Quick Info Sidebar */}
                <div className="lg:col-span-1">
                    <SOSQuickInfo
                        wearer={DEFAULT_WEARER_PROFILE}
                        contacts={DEFAULT_EMERGENCY_CONTACTS}
                        batteryLevel={batteryLevel}
                        connectionStatus={connectionStatus}
                        lastSeen={getTimeSinceUpdate()}
                        isStale={isStale}
                    />
                </div>
            </div>

            {/* Alert Panel */}
            <div className="mb-6">
                <SOSAlertPanel
                    activeAlert={activeAlert}
                    onResolve={handleResolve}
                    onAcknowledge={acknowledgeAlert}
                    isTestMode={isTestMode}
                />
            </div>

            {/* Test Controls */}
            <div className="mb-6">
                <SOSTestControls
                    onSimulateSOS={handleSimulateSOS}
                    onRandomLocation={handleRandomLocation}
                    onClearHistory={clearHistory}
                    onTestSound={playTestSound}
                    isAlertActive={!!activeAlert}
                    soundEnabled={preferences.sound}
                    onToggleSound={() => togglePreference('sound')}
                />
            </div>

            {/* Alert History */}
            <SOSAlertHistory
                history={alertHistory}
                onClearHistory={clearHistory}
                showClear={true}
            />
        </div>
    );
};

export default SOSPage;
