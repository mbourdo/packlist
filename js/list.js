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

  // Show trip info with editable title
  document.querySelector(".list-info").innerHTML = `
    <div class="list-title-row">
      <h2 contenteditable="true" oninput="saveCurrentState()">${list.name || "Trip Name"}</h2>
      <img src="assets/images/pencil-icon.png" class="edit-icon" onclick="this.previousElementSibling.focus()">
    </div>
    <p>${formatDate(list.startDate)} - ${formatDate(list.endDate)}</p>
    <p>${list.destination || "Destination here"}</p>
  `;

  const container = document.getElementById("category-list");
  container.innerHTML = "";
  categoryCount = 0;

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

// === Add Category
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
          <img src="assets/images/pencil-icon.png" class="edit-icon" onclick="this.previousElementSibling.focus()">
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

// === Create Item HTML
function createItemHTML(qty, name, checked) {
  return `
    <div class="item">
      <input type="checkbox" ${checked ? "checked" : ""} onchange="saveCurrentState()">
      <span contenteditable="true" 
            onblur="saveCurrentState()" 
            onkeydown="exitOnEnter(event)">
        ${qty}x ${name}
      </span>
      <button onclick="this.parentElement.remove(); saveCurrentState()">x</button>
    </div>
  `;
}


// === Add Item (updated version) ===
function addItem(event, id) {
  if (event.key === "Enter") {
    event.preventDefault();
    const input = event.target;
    const value = input.value.trim();
    if (!value) return;

    const { qty, name } = parseItem(value);
    const container = document.getElementById(`${id}-items`);
    
    // Check for existing item with same name
    let existingItem = null;
    container.querySelectorAll(".item").forEach(item => {
      const itemText = item.querySelector("span").textContent.trim();
      const itemMatch = itemText.match(/^(\d+)x\s(.+)$/i);
      if (itemMatch && itemMatch[2].toLowerCase() === name.toLowerCase()) {
        existingItem = item;
      }
    });

    if (existingItem) {
      // Update existing item
      const existingSpan = existingItem.querySelector("span");
      const existingText = existingSpan.textContent.trim();
      const existingMatch = existingText.match(/^(\d+)x\s(.+)$/i);
      
      if (existingMatch) {
        const existingQty = parseInt(existingMatch[1]);
        const newQty = existingQty + parseInt(qty);
        existingSpan.textContent = `${newQty}x ${existingMatch[2]}`;
        saveCurrentState();
      }
    } else {
      // Create new item
      const item = document.createElement("div");
      item.className = "item";

      item.innerHTML = `
        <input type="checkbox" onchange="saveCurrentState()">
        <span contenteditable="true" 
              onblur="saveCurrentState()" 
              onkeydown="exitOnEnter(event)">
          ${qty}x ${name}
        </span>
        <button onclick="this.parentElement.remove(); saveCurrentState()">x</button>
      `;

      container.insertBefore(item, input.parentElement);
      enableDrag(id);
    }

    input.value = "";
    saveCurrentState();
  }
}

// === Parse Input (updated to handle quantity better) ===
function parseItem(input) {
  // First try matching "3x Item" or "3, Item" format
  let match = input.match(/^(\d+)[x,]?\s*(.+)$/i);
  
  // If no match, try "Item x3" format
  if (!match) {
    match = input.match(/^(.+?)\s*x\s*(\d+)$/i);
    if (match) {
      return { qty: match[2], name: match[1].trim() };
    }
  }
  
  // Default to quantity 1 if no numbers found
  return match ? { qty: match[1], name: match[2].trim() } : { qty: "1", name: input.trim() };
}

// === Exit contenteditable on Enter
function exitOnEnter(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    e.target.blur();
  }
}

// === Save All to Firestore
async function saveCurrentState() {
  if (!currentListId) return;

  const listName = document.querySelector(".list-info h2")?.textContent.trim();
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
    name: listName,
    categories: updatedCategories
  });
}

// === Collapse
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

// === Drag & Drop
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

// === Nav
function goBack() {
  window.history.back();
}

function saveList() {
  localStorage.setItem("tripName", currentListData.name);
  window.location.href = "save.html";
}

// === Init
window.onload = () => {
  loadListFromFirestore();

  const addCategoryBtn = document.getElementById("addCategoryBtn");
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener("click", addCategory);
  }
};

// === Globals
window.goBack = goBack;
window.saveList = saveList;
window.addItem = addItem;
window.toggleCollapse = toggleCollapse;
window.deleteCategory = deleteCategory;
window.exitOnEnter = exitOnEnter;
window.addCategory = addCategory;