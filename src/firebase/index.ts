// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3kyjbBf637OZtjx4MYTPlPBOEsdeUW0s",
  authDomain: "svelte-phone-auth-dev.firebaseapp.com",
  projectId: "svelte-phone-auth-dev",
  storageBucket: "svelte-phone-auth-dev.appspot.com",
  messagingSenderId: "433278973205",
  appId: "1:433278973205:web:0b4aaf5fce02c8716c651c",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
