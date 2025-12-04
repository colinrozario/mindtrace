/**
 * Geocoding Utilities
 * Address lookup using OpenStreetMap Nominatim API (free, no API key required)
 */

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

/**
 * Reverse geocode coordinates to get human-readable address
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} Address string or coordinate fallback
 */
export const reverseGeocode = async (lat, lng) => {
    try {
        const response = await fetch(
            `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'MindTrace/1.0 (https://mindtrace.app)'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Geocoding request failed');
        }

        const data = await response.json();

        if (data && data.display_name) {
            return formatAddress(data);
        }

        return formatCoordinates(lat, lng);
    } catch (error) {
        console.warn('Geocoding failed:', error);
        return formatCoordinates(lat, lng);
    }
};

/**
 * Format geocoding response into a readable address
 * @param {Object} data - Nominatim response data
 * @returns {string}
 */
const formatAddress = (data) => {
    const address = data.address;

    if (!address) {
        return data.display_name || 'Unknown location';
    }

    // Build a concise address
    const parts = [];

    // Street/road
    if (address.road) {
        if (address.house_number) {
            parts.push(`${address.house_number} ${address.road}`);
        } else {
            parts.push(address.road);
        }
    }

    // Neighborhood/suburb
    if (address.neighbourhood) {
        parts.push(address.neighbourhood);
    } else if (address.suburb) {
        parts.push(address.suburb);
    }

    // City
    if (address.city) {
        parts.push(address.city);
    } else if (address.town) {
        parts.push(address.town);
    } else if (address.village) {
        parts.push(address.village);
    }

    // State/postal
    if (address.state) {
        const stateWithPostal = address.postcode
            ? `${address.state} ${address.postcode}`
            : address.state;
        parts.push(stateWithPostal);
    }

    return parts.join(', ') || data.display_name || 'Unknown location';
};

/**
 * Format coordinates as a fallback when geocoding fails
 * @param {number} lat 
 * @param {number} lng 
 * @returns {string}
 */
export const formatCoordinates = (lat, lng) => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
};

/**
 * Check if coordinates are valid
 * @param {number} lat 
 * @param {number} lng 
 * @returns {boolean}
 */
export const isValidCoordinates = (lat, lng) => {
    return (
        typeof lat === 'number' &&
        typeof lng === 'number' &&
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
    );
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {number} lat1 
 * @param {number} lng1 
 * @param {number} lat2 
 * @param {number} lng2 
 * @returns {number} Distance in meters
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

/**
 * Generate Google Maps directions URL
 * @param {number} lat 
 * @param {number} lng 
 * @returns {string}
 */
export const getDirectionsUrl = (lat, lng) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
};

/**
 * Generate Google Maps URL for a location
 * @param {number} lat 
 * @param {number} lng 
 * @returns {string}
 */
export const getMapUrl = (lat, lng) => {
    return `https://www.google.com/maps?q=${lat},${lng}`;
};
