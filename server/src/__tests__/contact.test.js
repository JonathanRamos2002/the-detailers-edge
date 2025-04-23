const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');
const request = require('supertest');
const app = require('../tests/setup');
const { db } = require('../config/firebase-config');

describe('Contact API', () => {
    const mockContactMessage = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test subject',
        message: 'Test message'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/contact', () => {
        it('should create a new contact message', async () => {
            db.collection().add.mockResolvedValueOnce({ id: 'test-id' });

            const response = await request(app)
                .post('/api/contact')
                .send(mockContactMessage)
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Message sent successfully');
            expect(response.body).toHaveProperty('submissionId', 'test-id');
        });

        it('should handle missing required fields', async () => {
            const response = await request(app)
                .post('/api/contact')
                .send({
                    name: 'Test User'
                    // Missing email, subject, and message
                })
                .expect(400);

            expect(response.body).toHaveProperty('message', 'All fields are required');
            expect(response.body).toHaveProperty('missing');
            expect(response.body.missing).toContain('email');
            expect(response.body.missing).toContain('subject');
            expect(response.body.missing).toContain('message');
        });

        it('should handle invalid email format', async () => {
            const response = await request(app)
                .post('/api/contact')
                .send({
                    ...mockContactMessage,
                    email: 'invalid-email'
                })
                .expect(400);

            expect(response.body).toHaveProperty('message', 'Invalid email format');
        });

        it('should handle database errors', async () => {
            db.collection().add.mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app)
                .post('/api/contact')
                .send(mockContactMessage)
                .expect(500);

            expect(response.body).toHaveProperty('message', 'Failed to process message');
            expect(response.body).toHaveProperty('error');
        });
    });
}); 