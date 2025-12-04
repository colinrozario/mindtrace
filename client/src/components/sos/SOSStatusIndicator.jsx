/**
 * SOSStatusIndicator Component
 * Displays battery level, connection status, and last sync time
 */

import { Battery, BatteryLow, BatteryMedium, BatteryFull, Wifi, WifiOff, Clock } from 'lucide-react';

/**
 * @param {Object} props
 * @param {number} props.batteryLevel - Battery percentage (0-100)
 * @param {'online' | 'offline'} props.connectionStatus - Connection status
 * @param {string} props.lastSeen - Time since last update
 * @param {boolean} [props.isStale] - Whether location data is stale
 * @param {'compact' | 'full'} [props.variant='full'] - Display variant
 */
const SOSStatusIndicator = ({
    batteryLevel,
    connectionStatus,
    lastSeen,
    isStale = false,
    variant = 'full'
}) => {
    // Determine battery icon and color
    const getBatteryDisplay = () => {
        if (batteryLevel <= 10) {
            return { Icon: BatteryLow, color: 'text-red-500', bg: 'bg-red-50' };
        }
        if (batteryLevel <= 25) {
            return { Icon: BatteryLow, color: 'text-amber-500', bg: 'bg-amber-50' };
        }
        if (batteryLevel <= 50) {
            return { Icon: BatteryMedium, color: 'text-amber-500', bg: 'bg-amber-50' };
        }
        return { Icon: BatteryFull, color: 'text-emerald-500', bg: 'bg-emerald-50' };
    };

    const { Icon: BatteryIcon, color: batteryColor, bg: batteryBg } = getBatteryDisplay();
    const isOnline = connectionStatus === 'online';

    if (variant === 'compact') {
        return (
            <div className="flex items-center gap-3">
                {/* Connection */}
                <div
                    className={`flex items-center gap-1.5 ${isOnline ? 'text-emerald-600' : 'text-gray-400'}`}
                    aria-label={`Connection: ${isOnline ? 'Online' : 'Offline'}`}
                >
                    {isOnline ? (
                        <Wifi className="h-4 w-4" />
                    ) : (
                        <WifiOff className="h-4 w-4" />
                    )}
                </div>

                {/* Battery */}
                <div
                    className={`flex items-center gap-1 ${batteryColor}`}
                    aria-label={`Battery: ${batteryLevel}%`}
                >
                    <BatteryIcon className="h-4 w-4" />
                    <span className="text-xs font-medium">{batteryLevel}%</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Connection</span>
                <div className="flex items-center gap-2">
                    {isOnline ? (
                        <>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <Wifi className="h-4 w-4 text-emerald-500" />
                            <span className="text-sm font-semibold text-emerald-600">Online</span>
                        </>
                    ) : (
                        <>
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            <WifiOff className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-semibold text-gray-500">Offline</span>
                        </>
                    )}
                </div>
            </div>

            {/* Battery Level */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Battery</span>
                <div className="flex items-center gap-2">
                    <div className={`p-1 rounded ${batteryBg}`}>
                        <BatteryIcon className={`h-4 w-4 ${batteryColor}`} />
                    </div>
                    <span className={`text-sm font-semibold ${batteryColor}`}>
                        {batteryLevel}%
                    </span>
                </div>
            </div>

            {/* Last Sync */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Sync</span>
                <div className="flex items-center gap-2">
                    <Clock className={`h-4 w-4 ${isStale ? 'text-amber-500' : 'text-gray-400'}`} />
                    <span className={`text-sm font-semibold ${isStale ? 'text-amber-600' : 'text-gray-900'}`}>
                        {lastSeen}
                    </span>
                </div>
            </div>

            {/* Stale Warning */}
            {isStale && (
                <div
                    className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg"
                    role="alert"
                >
                    <p className="text-xs text-amber-700">
                        ⚠️ Location data may be outdated
                    </p>
                </div>
            )}
        </div>
    );
};

export default SOSStatusIndicator;
