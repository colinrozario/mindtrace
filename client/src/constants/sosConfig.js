/**
 * SOS Configuration Constants
 */

// Color tokens for SOS states
export const SOS_COLORS = {
    safe: '#10B981',       // emerald-500 - normal/resolved state
    safeBg: '#D1FAE5',     // emerald-100 - safe background
    alert: '#F59E0B',      // amber-500 - active SOS
    alertBg: '#FEF3C7',    // amber-100 - alert background
    alertDark: '#D97706',  // amber-600 - darker alert
    critical: '#EF4444',   // red-500 - critical/emergency
    criticalBg: '#FEE2E2', // red-100 - critical background
    neutral: '#64748B',    // slate-500 - secondary elements
    surface: '#F8FAFC',    // slate-50 - light surface
    surfaceDark: '#1E293B' // slate-800 - dark surface
};

// Timing thresholds
export const STALE_LOCATION_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes
export const ALERT_POLL_INTERVAL_MS = 3000; // 3 seconds

// Mock locations around Kolkata for testing
export const MOCK_LOCATIONS = [
    {
        name: 'Park Street',
        lat: 22.5522,
        lng: 88.3527,
        address: 'Park Street, Kolkata, West Bengal 700016'
    },
    {
        name: 'Victoria Memorial',
        lat: 22.5448,
        lng: 88.3426,
        address: 'Victoria Memorial, 1 Queen\'s Way, Kolkata, West Bengal 700071'
    },
    {
        name: 'Howrah Bridge',
        lat: 22.5851,
        lng: 88.3468,
        address: 'Howrah Bridge, Kolkata, West Bengal 700001'
    },
    {
        name: 'Salt Lake City',
        lat: 22.5800,
        lng: 88.4200,
        address: 'Salt Lake City, Sector V, Kolkata, West Bengal 700091'
    },
    {
        name: 'New Town',
        lat: 22.5958,
        lng: 88.4663,
        address: 'New Town, Rajarhat, Kolkata, West Bengal 700156'
    },
    {
        name: 'Gariahat',
        lat: 22.5182,
        lng: 88.3681,
        address: 'Gariahat Road, Kolkata, West Bengal 700019'
    },
    {
        name: 'Esplanade',
        lat: 22.5636,
        lng: 88.3510,
        address: 'Esplanade, BBD Bagh, Kolkata, West Bengal 700001'
    }
];

// Default notification settings
export const DEFAULT_NOTIFICATION_PREFS = {
    sound: true,
    push: true,
    sms: true,
    email: false
};

// Default wearer profile (mock data)
export const DEFAULT_WEARER_PROFILE = {
    id: 'wearer-001',
    name: 'Grandma Mitra',
    photoUrl: null,
    medicalNotes: 'Mild dementia, takes medication twice daily. Prefers familiar routes.',
    batteryLevel: 78,
    connectionStatus: 'online',
    lastSeen: new Date().toISOString()
};

// Default emergency contacts (mock data)
export const DEFAULT_EMERGENCY_CONTACTS = [
    {
        id: 'contact-001',
        name: 'Dr. Sharma',
        phone: '+91 98301 45678',
        relationship: 'Family Doctor',
        priority: 1
    },
    {
        id: 'contact-002',
        name: 'Priya Mitra',
        phone: '+91 99030 12345',
        relationship: 'Daughter',
        priority: 2
    },
    {
        id: 'contact-003',
        name: 'Amit Mitra',
        phone: '+91 98765 43210',
        relationship: 'Son',
        priority: 3
    }
];

// Map default settings
export const MAP_CONFIG = {
    defaultCenter: [22.5726, 88.3639], // Kolkata center
    defaultZoom: 13,
    maxZoom: 18,
    minZoom: 10,
    tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
};
