/**
 * Convert 24-hour time format (HH:MM) to 12-hour format with AM/PM
 * @param {string} time24 - Time in 24-hour format (e.g., "14:30", "09:00")
 * @returns {string} Time in 12-hour format with AM/PM (e.g., "2:30 PM", "9:00 AM")
 */
export const formatTime12Hour = (time24) => {
  if (!time24) return '';
  
  // Handle if time already has AM/PM
  if (time24.includes('AM') || time24.includes('PM')) {
    return time24;
  }
  
  const [hours, minutes] = time24.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) {
    return time24; // Return original if invalid
  }
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for midnight
  
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Format a timestamp to IST (Indian Standard Time) in a readable format
 * @param {string|Date} timestamp - ISO timestamp or Date object
 * @returns {string} Formatted date/time in IST (e.g., "7 December 2025, 2:30 PM IST")
 */
export const formatToIST = (timestamp) => {
  if (!timestamp) return 'Never';
  
  try {
    const date = new Date(timestamp);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return timestamp.toString();
    }
    
    // Format to IST
    const formatted = date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    return `${formatted} IST`;
  } catch (error) {
    console.error('Error formatting date to IST:', error);
    return timestamp.toString();
  }
};
