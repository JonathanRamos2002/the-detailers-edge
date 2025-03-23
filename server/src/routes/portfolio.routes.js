const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/admin.middleware');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get all portfolio images
router.get('/', async (req, res) => {
    try {
        const result = await cloudinary.search
            .expression('folder:portfolio/*')
            .sort_by('created_at', 'desc')
            .execute();

        const images = result.resources.map(image => ({
            id: image.public_id,
            url: image.secure_url,
            title: image.filename.split('.')[0].replace(/-/g, ' '),
            createdAt: image.created_at
        }));

        res.json(images);
    } catch (error) {
        console.error('Error fetching portfolio images:', error);
        res.status(500).json({ message: 'Error fetching portfolio images' });
    }
});

// Upload new portfolio image (admin only)
router.post('/upload', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { image } = req.body;
        
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: 'portfolio',
            resource_type: 'auto',
            transformation: [
                { width: 800, quality: 'auto:good' },
                { fetch_format: 'auto' }
            ]
        });

        res.status(201).json({
            message: 'Image uploaded successfully',
            image: {
                id: result.public_id,
                url: result.secure_url,
                title: result.original_filename.split('.')[0].replace(/-/g, ' ')
            }
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Error uploading image' });
    }
});

// Delete portfolio image (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(id);

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Error deleting image' });
    }
});

module.exports = router; 