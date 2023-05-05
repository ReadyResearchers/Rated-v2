// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBPZX3p0qrubY21xoCLNJhvo0XoAokzhr4",
  authDomain: "react-native-rated.firebaseapp.com",
  projectId: "react-native-rated",
  storageBucket: "react-native-rated.appspot.com",
  messagingSenderId: "259620891087",
  appId: "1:259620891087:web:380a8b7c95c70fce0c8aba",
  measurementId: "G-GE2M6K6N9H"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth };
export default db;