/**
 * useLocationTracking Hook
 * Manages real-time location tracking and status monitoring
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { STALE_LOCATION_THRESHOLD_MS, MAP_CONFIG } from '../constants/sosConfig';
import { generateMockLocationUpdate, generateRandomLocation, simulateLocationDrift } from '../utils/mockLocationGenerator';

/**
 * Custom hook for location tracking
 * @param {Object} options
 * @param {boolean} [options.enablePolling=false] - Enable automatic location polling
 * @param {number} [options.pollInterval=5000] - Polling interval in ms
 * @returns {Object} Location state and actions
 */
export const useLocationTracking = ({ enablePolling = false, pollInterval = 5000 } = {}) => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [batteryLevel, setBatteryLevel] = useState(78);
    const [connectionStatus, setConnectionStatus] = useState('online');
    const [isStale, setIsStale] = useState(false);
    const [error, setError] = useState(null);

    const pollIntervalRef = useRef(null);

    // Check if location is stale
    useEffect(() => {
        if (!lastUpdate) {
            setIsStale(false);
            return;
        }

        const checkStale = () => {
            const timeSinceUpdate = Date.now() - new Date(lastUpdate).getTime();
            setIsStale(timeSinceUpdate > STALE_LOCATION_THRESHOLD_MS);
        };

        checkStale();
        const interval = setInterval(checkStale, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, [lastUpdate]);

    /**
     * Update location with new coordinates
     * @param {import('../types/sos.types').Location} location 
     */
    const updateLocation = useCallback((location) => {
        setCurrentLocation(location);
        setLastUpdate(new Date().toISOString());
        setIsStale(false);
        setError(null);
    }, []);

    /**
     * Update battery level
     * @param {number} level 
     */
    const updateBattery = useCallback((level) => {
        setBatteryLevel(Math.max(0, Math.min(100, level)));
    }, []);

    /**
     * Update connection status
     * @param {'online' | 'offline'} status 
     */
    const updateConnectionStatus = useCallback((status) => {
        setConnectionStatus(status);
    }, []);

    /**
     * Simulate receiving a location update (for testing)
     * @returns {import('../types/sos.types').LocationUpdate}
     */
    const simulateLocationUpdate = useCallback(() => {
        const update = currentLocation
            ? {
                ...generateMockLocationUpdate(),
                coordinates: simulateLocationDrift(currentLocation)
            }
            : generateMockLocationUpdate();

        setCurrentLocation(update.coordinates);
        setLastUpdate(update.timestamp);
        setBatteryLevel(update.batteryLevel);
        setConnectionStatus(update.connectionStrength === 'offline' ? 'offline' : 'online');
        setIsStale(false);

        return update;
    }, [currentLocation]);

    /**
     * Set location to a random mock location
     * @returns {import('../types/sos.types').Location}
     */
    const setRandomLocation = useCallback(() => {
        const location = generateRandomLocation();
        setCurrentLocation(location);
        setLastUpdate(new Date().toISOString());
        setIsStale(false);
        return location;
    }, []);

    /**
     * Initialize with default fallback location
     */
    const initializeDefaultLocation = useCallback(() => {
        const defaultLoc = {
            lat: MAP_CONFIG.defaultCenter[0],
            lng: MAP_CONFIG.defaultCenter[1],
            accuracy: 20,
            address: 'Default Location (Geolocation unavailable)'
        };
        setCurrentLocation(defaultLoc);
        setLastUpdate(new Date().toISOString());
        return defaultLoc;
    }, []);

    /**
     * Request real location from browser Geolocation API
     * Falls back to default location if unavailable or denied
     */
    const requestRealLocation = useCallback(() => {
        if (!navigator.geolocation) {
            console.warn('Geolocation not supported by browser, using default location');
            setError('Geolocation not supported');
            initializeDefaultLocation();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;

                // Try to get address via reverse geocoding
                let address = 'Current Location';
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        address = data.display_name || 'Current Location';
                    }
                } catch (err) {
                    console.warn('Reverse geocoding failed:', err);
                }

                const realLocation = {
                    lat: latitude,
                    lng: longitude,
                    accuracy: accuracy || 20,
                    address
                };

                setCurrentLocation(realLocation);
                setLastUpdate(new Date().toISOString());
                setError(null);
                console.log('Real location obtained:', realLocation);
            },
            (err) => {
                console.warn('Geolocation error:', err.message);
                setError(err.message);
                initializeDefaultLocation();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    }, [initializeDefaultLocation]);

    // Initialize on mount - try real location first
    useEffect(() => {
        if (!currentLocation) {
            requestRealLocation();
        }
    }, [currentLocation, requestRealLocation]);

    // Polling for location updates
    useEffect(() => {
        if (enablePolling && connectionStatus === 'online') {
            pollIntervalRef.current = setInterval(() => {
                simulateLocationUpdate();
            }, pollInterval);

            return () => {
                if (pollIntervalRef.current) {
                    clearInterval(pollIntervalRef.current);
                }
            };
        }
    }, [enablePolling, pollInterval, connectionStatus, simulateLocationUpdate]);

    /**
     * Get formatted time since last update
     * @returns {string}
     */
    const getTimeSinceUpdate = useCallback(() => {
        if (!lastUpdate) return 'Unknown';

        const diffMs = Date.now() - new Date(lastUpdate).getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);

        if (diffHours > 0) {
            return `${diffHours}h ${diffMins % 60}m ago`;
        }
        if (diffMins > 0) {
            return `${diffMins}m ago`;
        }
        if (diffSecs > 10) {
            return `${diffSecs}s ago`;
        }
        return 'Just now';
    }, [lastUpdate]);

    /**
     * Get battery status descriptor
     * @returns {'critical' | 'low' | 'medium' | 'good'}
     */
    const getBatteryStatus = useCallback(() => {
        if (batteryLevel <= 10) return 'critical';
        if (batteryLevel <= 25) return 'low';
        if (batteryLevel <= 50) return 'medium';
        return 'good';
    }, [batteryLevel]);

    return {
        currentLocation,
        lastUpdate,
        batteryLevel,
        connectionStatus,
        isStale,
        error,
        updateLocation,
        updateBattery,
        updateConnectionStatus,
        simulateLocationUpdate,
        setRandomLocation,
        initializeDefaultLocation,
        requestRealLocation,
        getTimeSinceUpdate,
        getBatteryStatus
    };
};

export default useLocationTracking;
