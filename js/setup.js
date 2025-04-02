// setup.js

import { db, auth } from "./firebase.js";
import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("setupForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("listName").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!name || !destination || !startDate || !endDate) {
      alert("Please fill out all fields.");
      return;
    }

    // Get current user UID
    const uid = localStorage.getItem("uid");
    if (!uid) {
      alert("You must be logged in.");
      window.location.href = "index.html";
      return;
    }

    // Create new list data
    const newList = {
      uid,
      name,
      destination,
      startDate,
      endDate,
      categories: [],  // Empty initially
      createdAt: Date.now()
    };

    try {
      // Save to Firestore
      const docRef = await addDoc(collection(db, "packlists"), newList);

      // Store the list ID and redirect to list editor
      localStorage.setItem("currentListId", docRef.id);
      window.location.href = "list.html";
    } catch (error) {
      console.error("Error creating list:", error.message);
      alert("Failed to create list.");
    }
  });
});
