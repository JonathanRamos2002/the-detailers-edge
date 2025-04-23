const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');
const request = require('supertest');
const app = require('../tests/setup');
const { db } = require('../config/firebase-config');

describe('Testimonials API', () => {
    const mockTestimonial = {
        name: 'Test User',
        email: 'test@example.com',
        rating: 5,
        comment: 'Great service!',
        serviceType: 'Full Detail'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/testimonials', () => {
        it('should return all testimonials', async () => {
            const mockDocs = [
                {
                    id: '1',
                    data: () => ({
                        ...mockTestimonial,
                        createdAt: new Date().toISOString(),
                        status: 'approved'
                    })
                }
            ];

            db.collection().orderBy.mockReturnThis();
            db.collection().get.mockResolvedValueOnce({
                docs: mockDocs,
                forEach: function(callback) {
                    this.docs.forEach(doc => callback(doc));
                }
            });

            const response = await request(app)
                .get('/api/testimonials')
                .expect(200);

            expect(response.body).toHaveProperty('testimonials');
            expect(response.body.testimonials).toHaveLength(1);
            expect(response.body.testimonials[0]).toMatchObject({
                id: '1',
                name: 'Test User',
                rating: 5,
                comment: 'Great service!',
                status: 'approved'
            });
            expect(response.body).toHaveProperty('pagination');
            expect(response.body.pagination).toMatchObject({
                total_records: 1,
                total_pages: 1,
                current_page_number: 1,
                page_size: 10
            });
        });

        it('should handle database errors', async () => {
            db.collection().orderBy.mockReturnThis();
            db.collection().get.mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app)
                .get('/api/testimonials')
                .expect(500);

            expect(response.body).toHaveProperty('message', 'Failed to fetch testimonials');
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('POST /api/testimonials', () => {
        it('should create a new testimonial', async () => {
            const mockDoc = {
                id: 'test-id'
            };

            db.collection().add.mockResolvedValueOnce(mockDoc);

            const response = await request(app)
                .post('/api/testimonials')
                .send(mockTestimonial)
                .expect(201);

            expect(response.body).toHaveProperty('message', 'Testimonial submitted successfully');
            expect(response.body).toHaveProperty('testimonial');
            expect(response.body.testimonial).toMatchObject({
                id: 'test-id',
                ...mockTestimonial
            });
        });

        it('should handle missing required fields', async () => {
            const response = await request(app)
                .post('/api/testimonials')
                .send({
                    name: 'Test User'
                    // Missing email, rating, and comment
                })
                .expect(400);

            expect(response.body).toHaveProperty('message', 'Required fields are missing');
            expect(response.body).toHaveProperty('missing');
            expect(response.body.missing).toContain('email');
            expect(response.body.missing).toContain('rating');
            expect(response.body.missing).toContain('comment');
        });

        it('should handle invalid rating', async () => {
            const response = await request(app)
                .post('/api/testimonials')
                .send({
                    ...mockTestimonial,
                    rating: 6 // Invalid rating > 5
                })
                .expect(400);

            expect(response.body).toHaveProperty('message', 'Rating must be between 1 and 5');
        });

        it('should handle database errors', async () => {
            db.collection().add.mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app)
                .post('/api/testimonials')
                .send(mockTestimonial)
                .expect(500);

            expect(response.body).toHaveProperty('message', 'Failed to submit testimonial');
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('PATCH /api/testimonials/:id/status', () => {
        it('should update testimonial status', async () => {
            const mockDoc = {
                exists: true,
                data: () => ({
                    ...mockTestimonial,
                    status: 'pending'
                })
            };

            db.collection().doc.mockReturnThis();
            db.collection().doc().get.mockResolvedValueOnce(mockDoc);
            db.collection().doc().update.mockResolvedValueOnce();

            const response = await request(app)
                .patch('/api/testimonials/1/status')
                .send({ status: 'approved' })
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Testimonial status updated successfully');
        });

        it('should handle invalid status', async () => {
            const response = await request(app)
                .patch('/api/testimonials/1/status')
                .send({ status: 'invalid' })
                .expect(400);

            expect(response.body).toHaveProperty('message', 'Invalid status');
        });

        it('should handle non-existent testimonial', async () => {
            db.collection().doc.mockReturnThis();
            db.collection().doc().get.mockRejectedValueOnce(new Error('Document not found'));

            const response = await request(app)
                .patch('/api/testimonials/999/status')
                .send({ status: 'approved' })
                .expect(404);

            expect(response.body).toHaveProperty('message', 'Testimonial not found');
        });
    });

    describe('DELETE /api/testimonials/:id', () => {
        it('should delete a testimonial', async () => {
            const mockDoc = {
                exists: true,
                data: () => ({
                    ...mockTestimonial,
                    status: 'pending'
                })
            };

            db.collection().doc.mockReturnThis();
            db.collection().doc().get.mockResolvedValueOnce(mockDoc);
            db.collection().doc().delete.mockResolvedValueOnce();

            const response = await request(app)
                .delete('/api/testimonials/1')
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Testimonial deleted successfully');
        });

        it('should handle non-existent testimonial', async () => {
            db.collection().doc.mockReturnThis();
            db.collection().doc().get.mockRejectedValueOnce(new Error('Document not found'));

            const response = await request(app)
                .delete('/api/testimonials/999')
                .expect(404);

            expect(response.body).toHaveProperty('message', 'Testimonial not found');
        });
    });
});