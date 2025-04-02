import { db, auth } from "./firebase.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Grab the list ID from localStorage
const listId = localStorage.getItem("currentListId");

auth.onAuthStateChanged(async (user) => {
  if (user) {
    const listRef = doc(db, "users", user.uid, "lists", listId);
    const docSnap = await getDoc(listRef);

    if (docSnap.exists()) {
      const list = docSnap.data();
      document.getElementById("list-name").textContent = list.name;
    }
  } else {
    // Redirect to login if not signed in
    window.location.href = "index.html";
  }
});

// Optional back button → goes to previous page
window.goBack = function () {
  window.history.back();
};