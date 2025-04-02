// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5b42rzU75IEQYDQs3_VgpeJbxNX04bh4",
  authDomain: "packlist-57baa.firebaseapp.com",
  projectId: "packlist-57baa",
  storageBucket: "packlist-57baa.firebasestorage.app",
  messagingSenderId: "135854446857",
  appId: "1:135854446857:web:ce8a62186d56d807779bd8"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

