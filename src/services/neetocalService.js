const NEETOCAL_API_BASE = 'https://ayoposi.neetocal.com/api/external/v1';
const API_KEY = import.meta.env.VITE_NEETOCAL_API_KEY;

console.log('Neetocal API Key available:', !!API_KEY);

/**
 * Base headers for all API requests
 */
const headers = {
  'Content-Type': 'application/json',
  'X-Api-Key': API_KEY,
  'Accept': 'application/json'
};

/**
 * Format a date string to the required format for the API
 * @param {Date} date 
 * @returns {string}
 */
const formatDateForAPI = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Format a time string to the required format for the API (HH:MM AM/PM)
 * @param {Date} date 
 * @returns {string}
 */
const formatTimeForAPI = (date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  }).toUpperCase();
};

/**
 * Get all bookings
 * @param {Object} params - Query parameters
 * @param {string} params.type - Filter by type (upcoming, past, cancelled, incomplete)
 * @param {string} params.host_email - Filter by host email
 * @param {string} params.client_email - Filter by client email
 * @param {number} params.page_number - Page number (default: 1)
 * @param {number} params.page_size - Number of bookings per page (default: 30)
 * @param {string} params.sorting_order - Sort order (asc or desc)
 */
export const getBookings = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = `${NEETOCAL_API_BASE}/bookings${queryParams ? `?${queryParams}` : ''}`;
  
  console.log('Fetching bookings from:', url);
  
  try {
    const response = await fetch(url, { 
      method: 'GET',
      headers
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Please check your API key');
      }
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response:', errorData);
      throw new Error(errorData.message || `Failed to fetch bookings: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Bookings data received:', data);
    return data;
  } catch (error) {
    console.error('Error in getBookings:', error);
    throw error;
  }
};

/**
 * Get a specific booking by ID
 * @param {string} bookingId - The booking ID (sid)
 */
export const getBooking = async (bookingId) => {
  try {
    const response = await fetch(`${NEETOCAL_API_BASE}/bookings/${bookingId}`, { headers });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Booking not found');
      }
      throw new Error('Failed to fetch booking');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in getBooking:', error);
    throw error;
  }
};

/**
 * Create a new booking
 * @param {Object} bookingData - The booking data
 * @param {string} bookingData.meeting_slug - Slug of scheduling link
 * @param {string} bookingData.name - Name of person making the booking
 * @param {string} bookingData.email - Email of person making the booking
 * @param {string} bookingData.slot_date - Date in YYYY-MM-DD format
 * @param {string} bookingData.slot_start_time - Time in HH:MM AM/PM format
 * @param {string} bookingData.time_zone - Time zone of person making the booking
 * @param {Object} [bookingData.form_responses] - Optional form responses
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${NEETOCAL_API_BASE}/bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(bookingData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create booking');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in createBooking:', error);
    throw error;
  }
};

/**
 * Update/Reschedule a booking
 * @param {string} bookingId - The booking ID (sid)
 * @param {Object} updateData - The data to update
 * @param {string} updateData.name - Name of person making the booking
 * @param {string} updateData.email - Email of person making the booking
 * @param {string} updateData.slot_date - Date in YYYY-MM-DD format
 * @param {string} updateData.slot_start_time - Time in HH:MM AM/PM format
 * @param {string} updateData.time_zone - Time zone
 * @param {Object} [updateData.form_responses] - Optional form responses
 * @param {string} [updateData.reschedule_reason] - Optional reason for rescheduling
 */
export const updateBooking = async (bookingId, updateData) => {
  try {
    const response = await fetch(`${NEETOCAL_API_BASE}/bookings/${bookingId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update booking');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in updateBooking:', error);
    throw error;
  }
};

/**
 * Cancel a booking
 * @param {string} bookingId - The booking ID (sid)
 * @param {string} [cancelReason] - Optional reason for cancellation
 */
export const cancelBooking = async (bookingId, cancelReason = '') => {
  try {
    const url = new URL(`${NEETOCAL_API_BASE}/bookings/${bookingId}/cancel`);
    if (cancelReason) {
      url.searchParams.append('cancel_reason', cancelReason);
    }
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to cancel booking');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in cancelBooking:', error);
    throw error;
  }
};

/**
 * Get available slots for a meeting
 * @param {string} meetingSlug - The meeting slug
 * @param {Object} params - Query parameters
 */
export const getAvailableSlots = async (meetingSlug, params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${NEETOCAL_API_BASE}/slots/${meetingSlug}${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch available slots');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in getAvailableSlots:', error);
    throw error;
  }
}; 