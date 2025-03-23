// Cloudinary configuration
export const CLOUDINARY_CLOUD_NAME = 'dq5s3dh6x'; // Replace with your cloud name
export const CLOUDINARY_UPLOAD_PRESET = 'your_upload_preset'; // Optional: for direct uploads

// Base URL for Cloudinary images
export const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Helper function to get optimized image URL
export const getOptimizedImageUrl = (imageId, options = {}) => {
    const {
        width = 'auto',
        quality = 'auto',
        format = 'auto',
        crop = 'fill',
        gravity = 'auto'
    } = options;

    return `${CLOUDINARY_BASE_URL}/w_${width},q_${quality},f_${format},c_${crop},g_${gravity}/${imageId}`;
};

// Example usage:
// getOptimizedImageUrl('portfolio/car-detail-1', { width: 800, quality: 80 }) 