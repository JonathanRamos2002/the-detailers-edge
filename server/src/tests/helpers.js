const admin = require('firebase-admin');
const db = admin.firestore();

// Helper function to clear test data
const clearTestData = async (collection) => {
    try {
        const snapshot = await db.collection(collection).get();
        const batch = db.batch();
        
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        await batch.commit();
    } catch (error) {
        console.error(`Error clearing test data from ${collection}:`, error);
    }
};

// Helper function to create test user
const createTestUser = async (userData = {}) => {
    try {
        const userRef = db.collection('users').doc();
        await userRef.set({
            email: 'test@example.com',
            name: 'Test User',
            role: 'user',
            ...userData
        });
        return userRef.id;
    } catch (error) {
        console.error('Error creating test user:', error);
        throw error;
    }
};

// Helper function to get test token
const getTestToken = () => {
    return 'valid-token';
};

module.exports = {
    clearTestData,
    createTestUser,
    getTestToken
}; 