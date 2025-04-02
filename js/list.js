// Firebase imports
import { db } from './firebase.js';
import {
  doc,
  getDoc,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';

let currentListId = localStorage.getItem("currentListId");
let currentListData = null;
let categoryCount = 0;

// === Load List from Firestore ===
async function loadListFromFirestore() {
  const docRef = doc(db, "packlists", currentListId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    alert("List not found.");
    return;
  }

  const list = docSnap.data();
  currentListData = list;

  // Show trip info
  document.querySelector(".list-info h2").textContent = list.name || "Trip Name";
  document.querySelector(".list-info p:nth-of-type(1)").textContent =
    formatDate(list.startDate) + " - " + formatDate(list.endDate);
  document.querySelector(".list-info p:nth-of-type(2)").textContent =
    list.destination || "Destination here";

  // Clear existing categories
  const container = document.getElementById("category-list");
  container.innerHTML = "";
  categoryCount = 0;

  // Load saved categories or defaults
  if (list.categories && list.categories.length > 0) {
    list.categories.forEach(cat => {
      addCategory(cat.title, cat.items || []);
    });
  } else {
    addCategory("Clothes");
    addCategory("Toiletries");
    addCategory("Essentials");
  }
}

// === Format date
function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

// === Add Category Section
function addCategory(title = "New Category", items = []) {
  const id = `cat-${categoryCount++}`;
  const category = document.createElement("div");
  category.classList.add("category");
  category.setAttribute("data-id", id);

  category.innerHTML = `
    <div class="category-header">
      <div class="left-side">
        <button class="collapse-btn" onclick="toggleCollapse('${id}')">▾</button>
        <div class="cat-title-row">
          <h3 contenteditable="true" oninput="saveCurrentState()">${title}</h3>
          <img src="assets/images/pencil-icon.png" class="edit-icon" onclick="focusPrevious(this)">
        </div>
      </div>
      <button class="delete-btn" onclick="deleteCategory('${id}')">x</button>
    </div>
    <div class="items" id="${id}-items">
      ${items.map(item => createItemHTML(item.qty, item.name, item.checked)).join("")}
      <div class="add-item">
        <input type="text" placeholder="+ Add item (Quantity, Name)" onkeypress="addItem(event, '${id}')">
      </div>
    </div>
  `;

  document.getElementById("category-list").appendChild(category);
  enableDrag(id);
  saveCurrentState();
}

// === Create HTML for Item
function createItemHTML(qty, name, checked) {
  return `
    <div class="item">
      <input type="checkbox" ${checked ? "checked" : ""} onchange="saveCurrentState()">
      <span>${qty}x ${name}</span>
      <button onclick="this.parentElement.remove(); saveCurrentState()">x</button>
    </div>
  `;
}

// === Parse item input
function parseItem(input) {
  const match = input.match(/^(\d+)[x,]?\s*(.+)$/i);
  return match ? { qty: match[1], name: match[2] } : { qty: "1", name: input };
}

// === Add Item
function addItem(event, id) {
  if (event.key === "Enter") {
    event.preventDefault();
    const input = event.target;
    const value = input.value.trim();
    if (!value) return;

    const { qty, name } = parseItem(value);
    const item = document.createElement("div");
    item.className = "item";

    item.innerHTML = `
      <input type="checkbox" onchange="saveCurrentState()">
      <span>${qty}x ${name}</span>
      <button onclick="this.parentElement.remove(); saveCurrentState()">x</button>
    `;

    const container = document.getElementById(`${id}-items`);
    container.insertBefore(item, input.parentElement);
    input.value = "";
    enableDrag(id);
    saveCurrentState();
  }
}

// === Save All Categories & Items
async function saveCurrentState() {
  if (!currentListId) return;

  const updatedCategories = [];

  document.querySelectorAll(".category").forEach(cat => {
    const title = cat.querySelector("h3").textContent.trim();
    const items = [];

    cat.querySelectorAll(".item").forEach(item => {
      const text = item.querySelector("span").textContent.trim();
      const checkbox = item.querySelector("input[type='checkbox']");
      const match = text.match(/^(\d+)x\s(.+)$/i);
      if (match) {
        items.push({
          qty: match[1],
          name: match[2],
          checked: checkbox.checked
        });
      }
    });

    updatedCategories.push({ title, items });
  });

  await updateDoc(doc(db, "packlists", currentListId), {
    categories: updatedCategories
  });
}

// === Collapse/Expand Category
function toggleCollapse(id) {
  const items = document.getElementById(`${id}-items`);
  items.classList.toggle("collapsed");
}

// === Delete Category
function deleteCategory(id) {
  const el = document.querySelector(`[data-id="${id}"]`);
  if (el && confirm("Delete this category?")) {
    el.remove();
    saveCurrentState();
  }
}

// === Pencil Focus
function focusPrevious(icon) {
  const prev = icon.previousElementSibling;
  if (prev && prev.isContentEditable) {
    prev.focus();
  }
}

// === Drag & Drop Support
function enableDrag(id) {
  const container = document.getElementById(`${id}-items`);
  const items = container.querySelectorAll(".item");

  items.forEach(item => {
    item.setAttribute("draggable", true);

    item.addEventListener("dragstart", () => {
      item.classList.add("dragging");
    });

    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      saveCurrentState();
    });

    item.addEventListener("dragover", e => e.preventDefault());

    item.addEventListener("drop", e => {
      e.preventDefault();
      const dragging = container.querySelector(".dragging");
      if (dragging && dragging !== item) {
        const rect = item.getBoundingClientRect();
        const offset = e.clientY - rect.top;
        if (offset > rect.height / 2) {
          item.after(dragging);
        } else {
          item.before(dragging);
        }
      }
    });
  });
}

// === Navigation
function goBack() {
  window.history.back();
}

function saveList() {
  localStorage.setItem("tripName", currentListData.name);
  window.location.href = "save.html";
}

// === Setup
window.onload = () => {
  loadListFromFirestore();

  const addCategoryBtn = document.getElementById("addCategoryBtn");
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener("click", () => {
      addCategory();
    });
  }
};

// === Global Functions for HTML
window.goBack = goBack;
window.saveList = saveList;
window.addItem = addItem;
window.toggleCollapse = toggleCollapse;
window.deleteCategory = deleteCategory;
window.focusPrevious = focusPrevious;
