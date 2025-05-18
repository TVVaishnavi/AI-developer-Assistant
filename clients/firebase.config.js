import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAcW-1AlO2W0fKF3eU85SfXM-2hQ8FmB4M",
  authDomain: "codemuse-ai---developer.firebaseapp.com",
  projectId: "codemuse-ai---developer",
  storageBucket: "codemuse-ai---developer.firebasestorage.app",
  messagingSenderId: "1027209515539",
  appId: "1:1027209515539:web:02a0a2a070bc7e506165e6",
  measurementId: "G-V2BWH6XKYW",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider }; 