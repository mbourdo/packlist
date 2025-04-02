// dash.js

import { db, auth } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const listGrid = document.getElementById("listGrid");

  // 🔐 Get current user ID
  const uid = localStorage.getItem("uid");
  if (!uid) {
    window.location.href = "index.html";
    return;
  }

  // 🧾 Setup delete confirmation modal
  let deleteDocId = null;
  const modalHTML = `
    <div id="deleteModal" class="modal-overlay" style="display:none;">
      <div class="modal">
        <p>Are you sure you want to delete this PackList?<br><small>This action cannot be undone</small></p>
        <div class="buttons">
          <button id="cancelDelete">Cancel</button>
          <button id="confirmDelete" class="danger">Delete</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById("deleteModal");
  const cancelBtn = document.getElementById("cancelDelete");
  const confirmBtn = document.getElementById("confirmDelete");

  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
    deleteDocId = null;
  });

  confirmBtn.addEventListener("click", async () => {
    if (deleteDocId) {
      await deleteDoc(doc(db, "packlists", deleteDocId));
      location.reload();
    }
  });

  // 📦 Fetch user's lists from Firestore
  const q = query(collection(db, "packlists"), where("uid", "==", uid));
  const snapshot = await getDocs(q);
  const userLists = [];

  snapshot.forEach((docSnap) => {
    userLists.push({ id: docSnap.id, ...docSnap.data() });
  });

  // 🗓 Format dates
  function formatDate(iso) {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }

  // 🧱 Render each card
  userLists.forEach((list) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="title">${list.name}</div>
      <div>${formatDate(list.startDate)} - ${formatDate(list.endDate)}</div>
      <div>${list.destination}</div>
      <span class="menu-icon">☰</span>
      <div class="context-menu">
        <button class="edit">Rename</button>
        <button class="print">Print</button>
        <button class="duplicate">Duplicate</button>
        <button class="delete">Delete</button>
      </div>
    `;

    // Click anywhere on card → open list
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".menu-icon") && !e.target.closest(".context-menu")) {
        localStorage.setItem("currentListId", list.id);
        window.location.href = "list.html";
      }
    });

    // Show/hide menu
    const menu = card.querySelector(".context-menu");
    const menuIcon = card.querySelector(".menu-icon");
    menuIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".context-menu").forEach((m) => m.classList.remove("active"));
      menu.classList.toggle("active");
    });
    document.body.addEventListener("click", () => {
      menu.classList.remove("active");
    });

    // ✏️ Rename
    card.querySelector(".edit").addEventListener("click", async (e) => {
      e.stopPropagation();
      const newName = prompt("Rename this list:", list.name);
      if (newName && newName.trim()) {
        await updateDoc(doc(db, "packlists", list.id), { name: newName.trim() });
        location.reload();
      }
    });

    // 🖨 Print
    card.querySelector(".print").addEventListener("click", (e) => {
      e.stopPropagation();
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html><head><title>${list.name}</title></head><body>
        <h1>${list.name}</h1>
        <p><strong>Destination:</strong> ${list.destination}</p>
        <p><strong>Dates:</strong> ${formatDate(list.startDate)} - ${formatDate(list.endDate)}</p>
        ${list.categories.map(cat => `
          <h2>${cat.title}</h2>
          <ul>${cat.items.map(item => `<li>${item.qty}x ${item.name}</li>`).join("")}</ul>
        `).join("")}
        <script>window.onload = () => window.print();</script>
        </body></html>
      `);
      printWindow.document.close();
    });

    // 🧬 Duplicate
    card.querySelector(".duplicate").addEventListener("click", async (e) => {
      e.stopPropagation();
      const copy = { ...list, name: list.name + " (Copy)", createdAt: Date.now() };
      delete copy.id;
      await addDoc(collection(db, "packlists"), copy);
      location.reload();
    });

    // 🗑 Delete
    card.querySelector(".delete").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteDocId = list.id;
      modal.style.display = "flex";
    });

    listGrid.appendChild(card);
  });

  // ➕ New List Card
  const newCard = document.createElement("div");
  newCard.className = "card new-list";
  newCard.innerHTML = `
    <div class="new-list">
      <div>＋</div>
      <strong>New List</strong>
    </div>
  `;
  newCard.addEventListener("click", () => {
    window.location.href = "setup.html";
  });
  listGrid.appendChild(newCard);

  // 👤 Profile icon → back to login
  const profileIcon = document.querySelector(".icon");
  if (profileIcon) {
    profileIcon.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
});
