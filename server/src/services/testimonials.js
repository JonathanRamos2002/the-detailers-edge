const { db } = require('../config/firebase-config');
const { FieldValue } = require('firebase-admin/firestore');

/**
 * Create a new testimonial
 */
const createTestimonial = async (testimonialData) => {
  try {
    const testimonialsRef = db.collection('testimonials');
    const testimonial = await testimonialsRef.add({
      ...testimonialData,
      createdAt: FieldValue.serverTimestamp(),
      status: 'pending' // Default status for moderation
    });

    return {
      id: testimonial.id,
      ...testimonialData
    };
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
};

/**
 * Get all approved testimonials with pagination
 */
const getTestimonials = async (filters = {}) => {
  try {
    const {
      page_number = 1,
      page_size = 10,
      status = 'approved'
    } = filters;

    let query = db.collection('testimonials');

    // First, just get all testimonials and order by createdAt
    query = query.orderBy('createdAt', 'desc');

    // Get testimonials
    const snapshot = await query.get();
    const testimonials = [];
    
    // Log all testimonials for debugging
    console.log('All testimonials in database:');
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log('Testimonial:', { id: doc.id, ...data });
      // Temporarily remove status filter to see all testimonials
      testimonials.push({
        id: doc.id,
        ...data
      });
    });

    console.log(`Total testimonials found: ${testimonials.length}`);

    // Handle pagination in memory
    const startIndex = (page_number - 1) * page_size;
    const paginatedTestimonials = testimonials.slice(startIndex, startIndex + page_size);

    return {
      testimonials: paginatedTestimonials,
      pagination: {
        total_records: testimonials.length,
        total_pages: Math.ceil(testimonials.length / page_size),
        current_page_number: parseInt(page_number),
        page_size: parseInt(page_size)
      }
    };
  } catch (error) {
    console.error('Error getting testimonials:', error);
    throw error;
  }
};

/**
 * Update testimonial status (for moderation)
 */
const updateTestimonialStatus = async (testimonialId, status) => {
  try {
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      throw new Error('Invalid status');
    }

    const testimonialRef = db.collection('testimonials').doc(testimonialId);
    await testimonialRef.update({
      status,
      updatedAt: FieldValue.serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error updating testimonial status:', error);
    throw error;
  }
};

/**
 * Delete a testimonial
 */
const deleteTestimonial = async (testimonialId) => {
  try {
    const testimonialRef = db.collection('testimonials').doc(testimonialId);
    await testimonialRef.delete();
    return true;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
};

module.exports = {
  createTestimonial,
  getTestimonials,
  updateTestimonialStatus,
  deleteTestimonial
}; 