const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/admin.middleware');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { db } = require('../config/firebase-config');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
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

// Get all services
router.get('/', async (req, res) => {
    try {
        const servicesRef = db.collection('services');
        const snapshot = await servicesRef.get();
        const services = [];
        
        snapshot.forEach(doc => {
            services.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Error fetching services' });
    }
});

// Create new service (admin only)
router.post('/', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { title, description, price, features } = req.body;
        let imageUrl = '';

        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                    folder: 'services',
                    resource_type: 'auto',
                    transformation: [
                        { width: 800, quality: 'auto:good' },
                        { fetch_format: 'auto' }
                    ]
                }, (error, result) => {
                    if (error) {
                        console.error('Error uploading to Cloudinary:', error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
                uploadStream.end(req.file.buffer);
            });
            
            imageUrl = uploadResult.secure_url;
        }

        const serviceData = {
            title,
            description,
            price,
            features: JSON.parse(features),
            image: imageUrl,
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('services').add(serviceData);
        res.status(201).json({ id: docRef.id, ...serviceData });
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ message: 'Error creating service' });
    }
});

// Update service (admin only)
router.put('/:id', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, features } = req.body;
        let imageUrl = '';

        const serviceRef = db.collection('services').doc(id);
        const serviceDoc = await serviceRef.get();

        if (!serviceDoc.exists) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Get the current service data
        const currentServiceData = serviceDoc.data();

        // If a new image is being uploaded
        if (req.file) {
            // Delete the old image from Cloudinary if it exists
            if (currentServiceData.image) {
                try {
                    // The URL format is: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/image.jpg
                    const urlParts = currentServiceData.image.split('/');
                    const uploadIndex = urlParts.indexOf('upload');
                    const publicId = urlParts.slice(uploadIndex + 2).join('/').split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                } catch (error) {
                    console.error('Error deleting old image from Cloudinary:', error);
                    // Continue with the update even if old image deletion fails to avoid breaking the service
                }
            }

            // Upload the new image
            // Promise is used to handle the asynchronous nature of the upload 
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                    folder: 'services',
                    resource_type: 'auto',
                    transformation: [
                        { width: 800, quality: 'auto:good' },
                        { fetch_format: 'auto' }
                    ]
                }, (error, result) => {
                    if (error) {
                        console.error('Error uploading to Cloudinary:', error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
                uploadStream.end(req.file.buffer);
            });
            
            imageUrl = uploadResult.secure_url;
        }

        const updateData = {
            title,
            description,
            price,
            features: JSON.parse(features),
            updatedAt: new Date().toISOString()
        };

        if (imageUrl) {
            updateData.image = imageUrl;
        }

        await serviceRef.update(updateData);
        res.json({ id, ...updateData });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Error updating service' });
    }
});

// Delete service (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const serviceRef = db.collection('services').doc(id);
        const serviceDoc = await serviceRef.get();

        if (!serviceDoc.exists) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Get the service data
        const serviceData = serviceDoc.data();

        // Delete image from Cloudinary
        if (serviceData.image) {
            try {
                // Extract the public ID from the Cloudinary URL
                // The URL format is: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/image.jpg
                const urlParts = serviceData.image.split('/');
                const uploadIndex = urlParts.indexOf('upload');
                const publicId = urlParts.slice(uploadIndex + 2).join('/').split('.')[0]; // Remove file extension

                // Delete the image from Cloudinary
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.error('Error deleting image from Cloudinary:', error);
                // Continue with service deletion even if image deletion fails to avoid breaking the service
            }
        }

        // Delete the service from Firestore
        await serviceRef.delete();
        res.json({ message: 'Service and associated image deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ message: 'Error deleting service' });
    }
});

module.exports = router; 