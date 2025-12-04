/**
 * useSOSAlerts Hook
 * Manages SOS alert state, history, and transitions
 */

import { useState, useCallback, useEffect } from 'react';
import { generateMockAlert, generateMockAlertHistory } from '../utils/mockLocationGenerator';
import { reverseGeocode } from '../utils/geocoding';

const STORAGE_KEY = 'mindtrace_sos_alerts';

/**
 * Load alert history from local storage
 * @returns {import('../types/sos.types').SOSAlert[]}
 */
const loadAlertHistory = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.warn('Failed to load alert history:', error);
    }
    return [];
};

/**
 * Save alert history to local storage
 * @param {import('../types/sos.types').SOSAlert[]} history 
 */
const saveAlertHistory = (history) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
        console.warn('Failed to save alert history:', error);
    }
};

/**
 * Custom hook for managing SOS alerts
 * @returns {Object} Alert state and actions
 */
export const useSOSAlerts = () => {
    const [activeAlert, setActiveAlert] = useState(null);
    const [alertHistory, setAlertHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTestMode, setIsTestMode] = useState(false);

    // Load history on mount
    useEffect(() => {
        const history = loadAlertHistory();
        if (history.length === 0) {
            // Generate some mock history for demo
            const mockHistory = generateMockAlertHistory(3);
            setAlertHistory(mockHistory);
            saveAlertHistory(mockHistory);
        } else {
            setAlertHistory(history);
        }
        setIsLoading(false);
    }, []);

    /**
     * Trigger a new SOS alert
     * @param {Partial<import('../types/sos.types').SOSAlert>} [overrides]
     * @returns {Promise<import('../types/sos.types').SOSAlert>}
     */
    const triggerAlert = useCallback(async (overrides = {}) => {
        const alert = generateMockAlert(overrides);

        // Try to get a better address via geocoding
        if (alert.location && !alert.location.address) {
            try {
                const address = await reverseGeocode(alert.location.lat, alert.location.lng);
                alert.location.address = address;
            } catch (error) {
                console.warn('Geocoding failed:', error);
            }
        }

        setActiveAlert(alert);
        setIsTestMode(alert.isTest || false);

        return alert;
    }, []);

    /**
     * Acknowledge an active alert
     * @param {string} alertId 
     */
    const acknowledgeAlert = useCallback((alertId) => {
        setActiveAlert(prev => {
            if (prev && prev.id === alertId) {
                return { ...prev, status: 'acknowledged' };
            }
            return prev;
        });
    }, []);

    /**
     * Resolve an active alert
     * @param {string} alertId 
     * @param {string} [resolvedBy] 
     * @param {string} [notes] 
     */
    const resolveAlert = useCallback((alertId, resolvedBy = 'Caregiver', notes = '') => {
        setActiveAlert(prev => {
            if (prev && prev.id === alertId) {
                const resolvedAlert = {
                    ...prev,
                    status: 'resolved',
                    resolvedAt: new Date().toISOString(),
                    resolvedBy,
                    notes: notes || prev.notes
                };

                // Add to history
                setAlertHistory(history => {
                    const newHistory = [resolvedAlert, ...history].slice(0, 50); // Keep last 50
                    saveAlertHistory(newHistory);
                    return newHistory;
                });

                return null; // Clear active alert
            }
            return prev;
        });
        setIsTestMode(false);
    }, []);

    /**
     * Clear active alert without resolving (cancel)
     */
    const cancelAlert = useCallback(() => {
        setActiveAlert(null);
        setIsTestMode(false);
    }, []);

    /**
     * Clear all alert history
     */
    const clearHistory = useCallback(() => {
        setAlertHistory([]);
        saveAlertHistory([]);
    }, []);

    /**
     * Update location of active alert
     * @param {import('../types/sos.types').Location} newLocation 
     */
    const updateAlertLocation = useCallback((newLocation) => {
        setActiveAlert(prev => {
            if (prev) {
                return { ...prev, location: newLocation };
            }
            return prev;
        });
    }, []);

    /**
     * Get alert duration in human-readable format
     * @param {import('../types/sos.types').SOSAlert} alert 
     * @returns {string}
     */
    const getAlertDuration = useCallback((alert) => {
        if (!alert) return '';

        const start = new Date(alert.timestamp);
        const end = alert.resolvedAt ? new Date(alert.resolvedAt) : new Date();
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
