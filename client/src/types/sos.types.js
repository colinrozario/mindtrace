/**
 * SOS Alert Types
 * JSDoc type definitions for SOS functionality
 */

/**
 * @typedef {Object} Location
 * @property {number} lat - Latitude coordinate
 * @property {number} lng - Longitude coordinate
 * @property {number} accuracy - Accuracy in meters
 * @property {string} [address] - Human-readable address (from geocoding)
 */

/**
 * @typedef {'pending' | 'acknowledged' | 'resolved'} AlertStatus
 */

/**
 * @typedef {Object} SOSAlert
 * @property {string} id - Unique alert identifier
 * @property {string} timestamp - ISO timestamp when alert was triggered
 * @property {Location} location - Location data at time of alert
 * @property {AlertStatus} status - Current status of the alert
 * @property {string} [resolvedAt] - ISO timestamp when resolved
 * @property {string} [resolvedBy] - Name/ID of person who resolved
 * @property {string} [notes] - Additional notes about the alert
 * @property {boolean} [isTest] - Whether this is a test alert
 */

/**
 * @typedef {Object} LocationUpdate
 * @property {string} timestamp - ISO timestamp of the update
 * @property {Location} coordinates - Current location
 * @property {number} batteryLevel - Battery percentage (0-100)
 * @property {'strong' | 'weak' | 'offline'} connectionStrength - Connection status
 */

/**
 * @typedef {Object} NotificationPreferences
 * @property {boolean} sound - Play audio on alert
 * @property {boolean} push - Send push notifications
 * @property {boolean} sms - Send SMS notifications
 * @property {boolean} email - Send email notifications
 */

/**
 * @typedef {Object} EmergencyContact
 * @property {string} id - Unique contact identifier
 * @property {string} name - Contact name
 * @property {string} phone - Phone number
 * @property {string} relationship - Relationship to wearer
 * @property {number} priority - Contact priority (1 = highest)
 */

/**
 * @typedef {Object} WearerProfile
 * @property {string} id - Unique wearer identifier
 * @property {string} name - Wearer's name
 * @property {string} [photoUrl] - URL to profile photo
 * @property {string} [medicalNotes] - Important medical information
 * @property {number} batteryLevel - Current glasses battery (0-100)
 * @property {'online' | 'offline'} connectionStatus - Current connection status
 * @property {string} lastSeen - ISO timestamp of last connection
 */

/**
 * @typedef {Object} SOSState
 * @property {SOSAlert | null} activeAlert - Currently active SOS alert
 * @property {SOSAlert[]} alertHistory - Past SOS alerts
 * @property {LocationUpdate | null} currentLocation - Latest location update
 * @property {WearerProfile | null} wearer - Wearer profile data
 * @property {EmergencyContact[]} emergencyContacts - Emergency contacts list
 * @property {NotificationPreferences} notificationPrefs - Notification settings
 * @property {boolean} isTestMode - Whether test mode is active
 */

export default {};
