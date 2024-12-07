// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth"; // Asegúrate de importar signOut

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(FirebaseApp);

// Exporta tanto FirebaseApp como auth
export { FirebaseApp, auth, signOut };
