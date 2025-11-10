import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDfCE8cXMXlUZgLjB1mqlj03tKAT7sDnaw",
  authDomain: "adminmello.firebaseapp.com",
  databaseURL: "https://adminmello-default-rtdb.firebaseio.com",
  projectId: "adminmello",
  storageBucket: "adminmello.firebasestorage.app",
  messagingSenderId: "934135366073",
  appId: "1:934135366073:web:f7e3129ab858057e06b668",
  measurementId: "G-MR85PK1Z0E"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
