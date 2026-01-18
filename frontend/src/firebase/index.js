// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdNXEmjbpYiCLLyNf6Uax97ppVMj1fExI",
  authDomain: "culd-hub-test.firebaseapp.com",
  projectId: "culd-hub-test",
  storageBucket: "culd-hub-test.appspot.com",
  appId: "1:846537088112:web:56a5075df77dc97dd5a8b5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
