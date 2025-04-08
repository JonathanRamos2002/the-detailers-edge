const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/admin.middleware');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit to prevent abuse
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'));
            return;
        }
        cb(null, true);
    }
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
router.post('/upload', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload_stream({
            folder: 'portfolio',
            resource_type: 'auto',
            transformation: [
                { width: 800, quality: 'auto:good' },
                { fetch_format: 'auto' }
            ]
        }, (error, result) => {
            if (error) {
                console.error('Error uploading to Cloudinary:', error);
                return res.status(500).json({ message: 'Error uploading image' });
            }

            res.status(201).json({
                message: 'Image uploaded successfully',
                image: {
                    id: result.public_id,
                    url: result.secure_url,
                    title: result.original_filename.split('.')[0].replace(/-/g, ' ')
                }
            });
        }).end(req.file.buffer);

    } catch (error) {
        console.error('Error processing upload:', error);
        res.status(500).json({ message: 'Error processing upload' });
    }
});

// Delete portfolio image (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        let { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: 'Image ID is required' });
        }

        // Add 'portfolio/' prefix if it's not already present
        if (!id.startsWith('portfolio/')) {
            id = `portfolio/${id}`;
        }

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(id);
        
        if (result.result === 'ok') {
            res.json({ message: 'Image deleted successfully' });
        } else {
            res.status(404).json({ message: 'Image not found or already deleted' });
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Error deleting image' });
    }
});

module.exports = router; 