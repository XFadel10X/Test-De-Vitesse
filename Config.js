import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBnHFrUxXFnJusq9btIfrCBOHXI628YVEs",
    authDomain: "speed-test-266e0.firebaseapp.com",
    projectId: "speed-test-266e0",
    storageBucket: "speed-test-266e0.appspot.com",
    messagingSenderId: "806407685056",
    appId: "1:806407685056:web:66239d8b1b782331363e25",
    measurementId: "G-0927KS41EB"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
