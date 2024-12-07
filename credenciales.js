// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth"; // Asegúrate de importar signOut

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7olXr4V-2X6e3eyLIGGFFdvP4xLa40f8",
  authDomain: "app1-5.firebaseapp.com",
  projectId: "app1-5",
  storageBucket: "app1-5.firebasestorage.app",
  messagingSenderId: "337578760044",
  appId: "1:337578760044:web:54a4e2f172238d46ce4549",
};

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(FirebaseApp);

// Exporta tanto FirebaseApp como auth
export { FirebaseApp, auth, signOut };
