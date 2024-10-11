// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; // Firebase Storage 추가

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnj5FyDEmA5k25z1WwHGiLQmODBgPdQ30",
  authDomain: "delivery-sharing-b6e44.firebaseapp.com",
  databaseURL: "https://delivery-sharing-b6e44-default-rtdb.firebaseio.com",
  projectId: "delivery-sharing-b6e44",
  storageBucket: "delivery-sharing-b6e44.appspot.com",
  messagingSenderId: "723375501640",
  appId: "1:723375501640:web:9490af7fdc913a4dbc837d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app); // Firebase Storage 초기화

export { auth, database, storage };
