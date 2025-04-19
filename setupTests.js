import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase
vi.mock('./firebase', () => ({
  auth: {
    createUserWithEmailAndPassword: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    signInWithPopup: vi.fn(),
    GoogleAuthProvider: vi.fn(),
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue('mock-token')
    }
  },
  db: {
    collection: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
  },
  analytics: {},
  default: {
    auth: {},
    db: {},
    analytics: {},
  },
}));

// Mock Firestore Functions
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(),
    collection: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
  };
});

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(() => ({
    addScope: vi.fn()
  })),
  onAuthStateChanged: vi.fn()
}));

// Mock Firebase Storage
vi.mock('firebase/storage', async () => {
  const actual = await vi.importActual('firebase/storage');
  return {
    ...actual,
    getStorage: vi.fn(),
    ref: vi.fn(),
    uploadBytes: vi.fn(),
    getDownloadURL: vi.fn(),
  };
});

// Mock React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
  };
});

// Mock API service
vi.mock('./services/api', () => ({
  default: {
    login: vi.fn(),
    signup: vi.fn(),
    googleSignIn: vi.fn(),
    getUserProfile: vi.fn(),
    updateUserProfile: vi.fn(),
    logout: vi.fn(),
  }
}));

// Mock axios
vi.mock('axios', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  defaults: {
    baseURL: 'http://localhost:5001'
  }
})); 