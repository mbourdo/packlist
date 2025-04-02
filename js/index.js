// index.js

// Import Firebase authentication functions
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Import the initialized Firebase app (from firebase.js)
import { auth } from "./firebase.js";

// LOGIN FUNCTION
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent page refresh

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    // Attempt to sign in user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("Login successful:", user.email);

    // Save the user's UID locally for use in other pages
    localStorage.setItem("uid", user.uid);

    // Redirect to dashboard
    window.location.href = "dash.html";
  } catch (error) {
    console.error("Login failed:", error.message);
    alert("Login failed: " + error.message);
  }
});

// CREATE ACCOUNT FUNCTION
document.querySelector(".create-account").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password to create an account.");
    return;
  }

  try {
    // Attempt to create new user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("Account created:", user.email);

    // Save the user's UID locally
    localStorage.setItem("uid", user.uid);

    // Redirect to dashboard
    window.location.href = "dash.html";
  } catch (error) {
    console.error("Signup failed:", error.message);
    alert("Signup failed: " + error.message);
  }
});
