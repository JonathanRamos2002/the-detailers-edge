// Cloudinary configuration
export const CLOUDINARY_CLOUD_NAME = 'dq5s3dh6x';
export const CLOUDINARY_UPLOAD_PRESET = 'portfolio_upload';

// Base URL for Cloudinary images
export const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

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
