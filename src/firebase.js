// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnj5FyDEmA5k25z1WwHGiLQmODBgPdQ30",
  authDomain: "delivery-sharing-b6e44.firebaseapp.com",
  databaseURL: "https://delivery-sharing-b6e44-default-rtdb.firebaseio.com",
  projectId: "delivery-sharing-b6e44",
  storageBucket: "delivery-sharing-b6e44.appspot.com",
  messagingSenderId: "723375501640",
  appId: "1:723375501640:web:9490af7fdc913a4dbc837d",
  measurementId: "G-JK3Y3JD9RG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);