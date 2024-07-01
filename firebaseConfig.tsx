// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const firebaseApikey = import.meta.env.VITE_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: 'AIzaSyBh7j12rH1u7azn6GyvO4aT1VQ4z5KJYS0',
  authDomain: 'rrhh-6d175.firebaseapp.com',
  projectId: 'rrhh-6d175',
  storageBucket: 'rrhh-6d175.appspot.com',
  messagingSenderId: '798469556303',
  appId: '1:798469556303:web:a10c9ff6dcd6db744b423a',
  measurementId: 'G-SK92FXVQG5',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);
