/**
 * useNotifications Hook
 * Manages notification preferences, sounds, and browser notifications
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { DEFAULT_NOTIFICATION_PREFS } from '../constants/sosConfig';

const STORAGE_KEY = 'mindtrace_notification_prefs';

// Active audio context reference for stopping the ringtone
let activeAudioContext = null;
let ringtoneInterval = null;

/**
 * Ring tone alert using Web Audio API - creates a phone-like ringtone
 * @param {boolean} loop - Whether to loop the ringtone
 * @returns {Function} Function to stop the ringtone
 */
const playRingtone = (loop = true) => {
    try {
        // Stop any existing ringtone
        stopRingtone();

        activeAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        const ctx = activeAudioContext;

        const playRingPattern = () => {
            const now = ctx.currentTime;

            // Create a classic phone ring pattern (two-tone alternating)
            const pattern = [
                // First ring burst
                { freq: 440, start: 0.0, dur: 0.1 },
                { freq: 480, start: 0.1, dur: 0.1 },
                { freq: 440, start: 0.2, dur: 0.1 },
                { freq: 480, start: 0.3, dur: 0.1 },
                { freq: 440, start: 0.4, dur: 0.1 },
                { freq: 480, start: 0.5, dur: 0.1 },
                // Pause, then second ring burst
                { freq: 440, start: 0.9, dur: 0.1 },
                { freq: 480, start: 1.0, dur: 0.1 },
                { freq: 440, start: 1.1, dur: 0.1 },
                { freq: 480, start: 1.2, dur: 0.1 },
                { freq: 440, start: 1.3, dur: 0.1 },
                { freq: 480, start: 1.4, dur: 0.1 },
            ];

            pattern.forEach(({ freq, start, dur }) => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.frequency.value = freq;
                oscillator.type = 'sine';

                // Smooth envelope for a pleasant ring sound
                gainNode.gain.setValueAtTime(0, now + start);
                gainNode.gain.linearRampToValueAtTime(0.4, now + start + 0.02);
                gainNode.gain.setValueAtTime(0.4, now + start + dur - 0.02);
                gainNode.gain.linearRampToValueAtTime(0, now + start + dur);

                oscillator.start(now + start);
                oscillator.stop(now + start + dur);
            });
        };

        // Play immediately
        playRingPattern();

        // Loop the ringtone every 2.5 seconds if looping is enabled
        if (loop) {
            ringtoneInterval = setInterval(() => {
                if (activeAudioContext && activeAudioContext.state !== 'closed') {
                    playRingPattern();
                }
            }, 2500);
        }

        return stopRingtone;
    } catch (error) {
        console.warn('Audio playback failed:', error);
        return () => { };
    }
};

/**
 * Stop the currently playing ringtone
 */
const stopRingtone = () => {
    if (ringtoneInterval) {
        clearInterval(ringtoneInterval);
        ringtoneInterval = null;
    }
    if (activeAudioContext && activeAudioContext.state !== 'closed') {
        activeAudioContext.close().catch(() => { });
        activeAudioContext = null;
    }
};

/**
 * Load notification preferences from local storage
 * @returns {import('../types/sos.types').NotificationPreferences}
 */
const loadPreferences = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return { ...DEFAULT_NOTIFICATION_PREFS, ...JSON.parse(stored) };
        }
    } catch (error) {
        console.warn('Failed to load notification preferences:', error);
    }
    return DEFAULT_NOTIFICATION_PREFS;
};

/**
 * Save notification preferences to local storage
 * @param {import('../types/sos.types').NotificationPreferences} prefs 
 */
const savePreferences = (prefs) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (error) {
        console.warn('Failed to save notification preferences:', error);
    }
};

/**
 * Custom hook for notifications
 * @returns {Object} Notification state and actions
 */
export const useNotifications = () => {
    const [preferences, setPreferences] = useState(DEFAULT_NOTIFICATION_PREFS);
    const [showBanner, setShowBanner] = useState(false);
    const [bannerMessage, setBannerMessage] = useState('');
    const [hasPermission, setHasPermission] = useState(false);

    const bannerTimeoutRef = useRef(null);

    // Load preferences on mount
    useEffect(() => {
        setPreferences(loadPreferences());

        // Check browser notification permission
        if ('Notification' in window) {
            setHasPermission(Notification.permission === 'granted');
        }
    }, []);

    /**
     * Request browser notification permission
     * @returns {Promise<boolean>}
     */
    const requestPermission = useCallback(async () => {
        if (!('Notification' in window)) {
            console.warn('Browser does not support notifications');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            const granted = permission === 'granted';
            setHasPermission(granted);
            return granted;
        } catch (error) {
            console.error('Failed to request notification permission:', error);
            return false;
        }
    }, []);

    /**
     * Update a specific preference
     * @param {keyof import('../types/sos.types').NotificationPreferences} key 
     * @param {boolean} value 
     */
    const updatePreference = useCallback((key, value) => {
        setPreferences(prev => {
            const updated = { ...prev, [key]: value };
            savePreferences(updated);
            return updated;
        });
    }, []);

    /**
     * Toggle a preference
     * @param {keyof import('../types/sos.types').NotificationPreferences} key 
     */
    const togglePreference = useCallback((key) => {
        setPreferences(prev => {
            const updated = { ...prev, [key]: !prev[key] };
            savePreferences(updated);
            return updated;
        });
    }, []);

    /**
     * Show notification banner
     * @param {string} message 
     * @param {number} [duration=0] - Auto-hide duration in ms (0 = manual dismiss)
     */
    const showNotificationBanner = useCallback((message, duration = 0) => {
        setBannerMessage(message);
        setShowBanner(true);

        if (bannerTimeoutRef.current) {
            clearTimeout(bannerTimeoutRef.current);
        }

        if (duration > 0) {
            bannerTimeoutRef.current = setTimeout(() => {
                setShowBanner(false);
            }, duration);
        }
    }, []);

    /**
     * Hide notification banner and stop ringtone
     */
    const hideNotificationBanner = useCallback(() => {
        setShowBanner(false);
        stopRingtone(); // Stop the ringtone when banner is dismissed
        if (bannerTimeoutRef.current) {
            clearTimeout(bannerTimeoutRef.current);
        }
    }, []);

    /**
     * Trigger SOS notification (banner, sound, browser notification)
     * @param {string} message 
     * @param {import('../types/sos.types').Location} [location]
     */
    const triggerSOSNotification = useCallback((message, location) => {
        // Show banner
        showNotificationBanner(message);

        // Play ringtone if enabled (loops until dismissed)
        if (preferences.sound) {
            playRingtone(true);
        }

        // Send browser notification if enabled and permitted
        if (preferences.push && hasPermission && 'Notification' in window) {
            try {
                const notification = new Notification('🚨 SOS Alert - MindTrace', {
                    body: message + (location?.address ? `\n📍 ${location.address}` : ''),
                    icon: '/favicon.ico',
                    tag: 'sos-alert',
                    requireInteraction: true
                });

                notification.onclick = () => {
                    window.focus();
                    notification.close();
                };
            } catch (error) {
                console.warn('Browser notification failed:', error);
            }
        }
    }, [preferences.sound, preferences.push, hasPermission, showNotificationBanner]);

    /**
     * Play test sound (single play, no loop)
     */
    const playTestSound = useCallback(() => {
        playRingtone(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopRingtone();
            if (bannerTimeoutRef.current) {
                clearTimeout(bannerTimeoutRef.current);
            }
        };
    }, []);

    return {
        preferences,
        showBanner,
        bannerMessage,
        hasPermission,
        requestPermission,
        updatePreference,
        togglePreference,
        showNotificationBanner,
        hideNotificationBanner,
        triggerSOSNotification,
        playTestSound
    };
};

export default useNotifications;
