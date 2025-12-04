/**
 * useSOSAlerts Hook
 * Manages SOS alert state, history, and transitions with real-time backend integration
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { sosApi } from '../services/api';
import { reverseGeocode } from '../utils/geocoding';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing SOS alerts with real-time backend integration
 * @returns {Object} Alert state and actions
 */
export const useSOSAlerts = () => {
    const [activeAlert, setActiveAlert] = useState(null);
    const [alertHistory, setAlertHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTestMode, setIsTestMode] = useState(false);
    const pollIntervalRef = useRef(null);

    /**
     * Fetch active alert from backend
     */
    const fetchActiveAlert = useCallback(async () => {
        try {
            const response = await sosApi.getActiveAlert();
            if (response.data) {
                setActiveAlert(response.data);
                setIsTestMode(response.data.is_test || false);
            } else {
                setActiveAlert(null);
                setIsTestMode(false);
            }
        } catch (error) {
            console.error('Failed to fetch active alert:', error);
        }
    }, []);

    /**
     * Fetch alert history from backend
     */
    const fetchAlertHistory = useCallback(async () => {
        try {
            const response = await sosApi.getAlerts({ limit: 50, status: 'resolved' });
            setAlertHistory(response.data || []);
        } catch (error) {
            console.error('Failed to fetch alert history:', error);
        }
    }, []);

    // Load data on mount and set up polling
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await Promise.all([fetchActiveAlert(), fetchAlertHistory()]);
            setIsLoading(false);
        };

        loadData();

        // Poll for active alert updates every 3 seconds
        pollIntervalRef.current = setInterval(() => {
            fetchActiveAlert();
        }, 3000);

        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, [fetchActiveAlert, fetchAlertHistory]);

    /**
     * Trigger a new SOS alert
     * @param {Object} [options]
     * @param {boolean} [options.isTest] - Whether this is a test alert
     * @param {Object} [options.location] - Location data
     * @param {number} [options.batteryLevel] - Battery level
     * @param {string} [options.connectionStatus] - Connection status
     * @returns {Promise<Object>}
     */
    const triggerAlert = useCallback(async (options = {}) => {
        try {
            const alertData = {
                is_test: options.isTest || false,
                location: options.location || null,
                battery_level: options.batteryLevel || null,
                connection_status: options.connectionStatus || 'online'
            };

            // Try to get address via geocoding if location provided but no address
            if (alertData.location && !alertData.location.address) {
                try {
                    const address = await reverseGeocode(alertData.location.lat, alertData.location.lng);
                    alertData.location.address = address;
                } catch (error) {
                    console.warn('Geocoding failed:', error);
                }
            }

            const response = await sosApi.createAlert(alertData);
            const alert = response.data;
            
            setActiveAlert(alert);
            setIsTestMode(alert.is_test || false);
            
            toast.success(alert.is_test ? 'Test SOS alert created' : 'SOS alert triggered!');
            
            return alert;
        } catch (error) {
            console.error('Failed to trigger alert:', error);
            toast.error('Failed to trigger SOS alert');
            throw error;
        }
    }, []);

    /**
     * Acknowledge an active alert
     * @param {number} alertId 
     */
    const acknowledgeAlert = useCallback(async (alertId) => {
        try {
            const response = await sosApi.updateAlert(alertId, { status: 'acknowledged' });
            setActiveAlert(response.data);
            toast.success('Alert acknowledged');
        } catch (error) {
            console.error('Failed to acknowledge alert:', error);
            toast.error('Failed to acknowledge alert');
        }
    }, []);

    /**
     * Resolve an active alert
     * @param {number} alertId 
     * @param {string} [resolvedBy] 
     * @param {string} [notes] 
     */
    const resolveAlert = useCallback(async (alertId, resolvedBy = 'Caregiver', notes = '') => {
        try {
            await sosApi.updateAlert(alertId, {
                status: 'resolved',
                resolved_by: resolvedBy,
                notes: notes
            });
            
            setActiveAlert(null);
            setIsTestMode(false);
            
            // Refresh history
            await fetchAlertHistory();
            
            toast.success('Alert resolved successfully');
        } catch (error) {
            console.error('Failed to resolve alert:', error);
            toast.error('Failed to resolve alert');
        }
    }, [fetchAlertHistory]);

    /**
     * Clear active alert without resolving (cancel)
     */
    const cancelAlert = useCallback(async () => {
        if (activeAlert) {
            try {
                await sosApi.updateAlert(activeAlert.id, { status: 'resolved', resolved_by: 'System', notes: 'Cancelled' });
                setActiveAlert(null);
                setIsTestMode(false);
                await fetchAlertHistory();
            } catch (error) {
                console.error('Failed to cancel alert:', error);
            }
        }
    }, [activeAlert, fetchAlertHistory]);

    /**
     * Clear all alert history
     */
    const clearHistory = useCallback(async () => {
        try {
            await sosApi.clearHistory();
            setAlertHistory([]);
            toast.success('Alert history cleared');
        } catch (error) {
            console.error('Failed to clear history:', error);
            toast.error('Failed to clear history');
        }
    }, []);

    /**
     * Update location of active alert
     * @param {Object} newLocation 
     */
    const updateAlertLocation = useCallback(async (newLocation) => {
        if (activeAlert) {
            try {
                const response = await sosApi.updateAlert(activeAlert.id, { location: newLocation });
                setActiveAlert(response.data);
            } catch (error) {
                console.error('Failed to update alert location:', error);
            }
        }
    }, [activeAlert]);

    /**
     * Get alert duration in human-readable format
     * @param {Object} alert 
     * @returns {string}
     */
    const getAlertDuration = useCallback((alert) => {
        if (!alert) return '';

        const start = new Date(alert.timestamp);
        const end = alert.resolved_at ? new Date(alert.resolved_at) : new Date();
        const diffMs = end - start;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);

        if (diffHours > 0) {
            return `${diffHours}h ${diffMins % 60}m`;
        }
        if (diffMins > 0) {
            return `${diffMins}m`;
        }
        return 'Less than 1m';
    }, []);

    return {
        activeAlert,
        alertHistory,
        isLoading,
        isTestMode,
        triggerAlert,
        acknowledgeAlert,
        resolveAlert,
        cancelAlert,
        clearHistory,
        updateAlertLocation,
        getAlertDuration
    };
};

export default useSOSAlerts;
