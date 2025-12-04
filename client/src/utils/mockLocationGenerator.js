/**
 * Mock Location Generator
 * Utilities for generating test data for SOS functionality
 */

import { MOCK_LOCATIONS, DEFAULT_EMERGENCY_CONTACTS, DEFAULT_WEARER_PROFILE } from '../constants/sosConfig';

/**
 * Generate a unique ID
 * @returns {string}
 */
const generateId = () => {
    return `sos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get a random item from an array
 * @template T
 * @param {T[]} array 
 * @returns {T}
 */
const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

/**
 * Generate random accuracy value (in meters)
 * @returns {number}
 */
const generateAccuracy = () => {
    return Math.floor(Math.random() * 50) + 5; // 5-55 meters
};

/**
 * Generate a mock SOS alert
 * @param {Partial<import('../types/sos.types').SOSAlert>} [overrides]
 * @returns {import('../types/sos.types').SOSAlert}
 */
export const generateMockAlert = (overrides = {}) => {
    const mockLoc = getRandomItem(MOCK_LOCATIONS);

    return {
        id: generateId(),
        timestamp: new Date().toISOString(),
        location: {
            lat: mockLoc.lat + (Math.random() - 0.5) * 0.01, // Small variation
            lng: mockLoc.lng + (Math.random() - 0.5) * 0.01,
            accuracy: generateAccuracy(),
            address: mockLoc.address
        },
        status: 'pending',
        isTest: true,
        ...overrides
    };
};

/**
 * Generate a mock location update
 * @param {Partial<import('../types/sos.types').LocationUpdate>} [overrides]
 * @returns {import('../types/sos.types').LocationUpdate}
 */
export const generateMockLocationUpdate = (overrides = {}) => {
    const mockLoc = getRandomItem(MOCK_LOCATIONS);
    const batteryVariation = Math.floor(Math.random() * 10) - 5;

    return {
        timestamp: new Date().toISOString(),
        coordinates: {
            lat: mockLoc.lat + (Math.random() - 0.5) * 0.005,
            lng: mockLoc.lng + (Math.random() - 0.5) * 0.005,
            accuracy: generateAccuracy(),
            address: mockLoc.address
        },
        batteryLevel: Math.max(10, Math.min(100, 75 + batteryVariation)),
        connectionStrength: Math.random() > 0.2 ? 'strong' : 'weak',
        ...overrides
    };
};

/**
 * Generate a random location from mock locations
 * @returns {import('../types/sos.types').Location}
 */
export const generateRandomLocation = () => {
    const mockLoc = getRandomItem(MOCK_LOCATIONS);
    return {
        lat: mockLoc.lat,
        lng: mockLoc.lng,
        accuracy: generateAccuracy(),
        address: mockLoc.address
    };
};

/**
 * Generate mock alert history
 * @param {number} [count=5] - Number of historical alerts to generate
 * @returns {import('../types/sos.types').SOSAlert[]}
 */
export const generateMockAlertHistory = (count = 5) => {
    const history = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
        const alertTime = new Date(now - (i + 1) * 24 * 60 * 60 * 1000 * Math.random() * 7);
        const resolvedTime = new Date(alertTime.getTime() + Math.random() * 30 * 60 * 1000);
        const mockLoc = getRandomItem(MOCK_LOCATIONS);

        history.push({
            id: generateId(),
            timestamp: alertTime.toISOString(),
            location: {
                lat: mockLoc.lat,
                lng: mockLoc.lng,
                accuracy: generateAccuracy(),
                address: mockLoc.address
            },
            status: 'resolved',
            resolvedAt: resolvedTime.toISOString(),
            resolvedBy: getRandomItem(['Priya Mitra', 'Amit Mitra', 'System']),
            notes: getRandomItem([
                'False alarm - wearer pressed button accidentally',
                'Located and assisted wearer back home',
                'Wearer was disoriented but safe',
                'Quick response, situation resolved',
                null
            ]),
            isTest: true
        });
    }

    return history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

/**
 * Get mock wearer profile
 * @returns {import('../types/sos.types').WearerProfile}
 */
export const getMockWearerProfile = () => {
    return {
        ...DEFAULT_WEARER_PROFILE,
        batteryLevel: Math.floor(Math.random() * 30) + 60, // 60-90%
        lastSeen: new Date().toISOString()
    };
};

/**
 * Get mock emergency contacts
 * @returns {import('../types/sos.types').EmergencyContact[]}
 */
export const getMockEmergencyContacts = () => {
    return [...DEFAULT_EMERGENCY_CONTACTS];
};

/**
 * Simulate location drift (small movement over time)
 * @param {import('../types/sos.types').Location} currentLocation 
 * @returns {import('../types/sos.types').Location}
 */
export const simulateLocationDrift = (currentLocation) => {
    return {
        ...currentLocation,
        lat: currentLocation.lat + (Math.random() - 0.5) * 0.0005,
        lng: currentLocation.lng + (Math.random() - 0.5) * 0.0005,
        accuracy: generateAccuracy()
    };
};
