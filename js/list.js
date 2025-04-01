const idx = localStorage.getItem("currentIndex");
const lists = JSON.parse(localStorage.getItem("packlists")) || [];
const saved = lists[idx];

const defaultCategories = ["Clothes", "Toiletries", "Essentials"];
let categoryCount = 0;

window.onload = () => {
  if (!saved) return;

  // Set list title, dates, and destination
  document.querySelector(".list-info h2").textContent = saved.name;
  document.querySelector(".list-info p:nth-of-type(1)").textContent =
    formatDate(saved.startDate) + " - " + formatDate(saved.endDate);
  document.querySelector(".list-info p:nth-of-type(2)").textContent =
    saved.destination;

  // Load categories
  if (saved.categories && saved.categories.length > 0) {
    saved.categories.forEach(cat => addCategory(cat.title, cat.items));
  } else {
    defaultCategories.forEach(title => addCategory(title));
  }
};

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function goBack() {
  window.history.back();
}

function saveList() {
  localStorage.setItem("tripName", saved.name);
  window.location.href = "save.html";
}

// Add category with optional items
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
        <input type="text" placeholder="+ Add item (Quantity, Name)" 
               onkeypress="addItem(event, '${id}')">
      </div>
    </div>
  `;

  document.getElementById("category-list").appendChild(category);
  enableDrag(id);
  saveCurrentState();
}

// Collapse toggle
function toggleCollapse(id) {
  const items = document.getElementById(`${id}-items`);
  items.classList.toggle("collapsed");
}

// Delete category
function deleteCategory(id) {
  const el = document.querySelector(`[data-id="${id}"]`);
  if (el && confirm("Delete this category?")) {
    el.remove();
    saveCurrentState();
  }
}

// Add item by typing
function addItem(event, id) {
  if (event.key === "Enter") {
    event.preventDefault();
    const input = event.target;
    const value = input.value.trim();
    if (!value) return;

    const parsed = parseItem(value);
    const item = document.createElement("div");
    item.className = "item";
    item.setAttribute("draggable", "true");

    item.innerHTML = `
      <input type="checkbox" onchange="saveCurrentState()">
      <span>${parsed}</span>
      <button onclick="this.parentElement.remove(); saveCurrentState()">x</button>
    `;

    input.closest(".items").insertBefore(item, input.parentElement);
    input.value = "";
    enableDrag(id);
    saveCurrentState();
  }
}

// Format quantity input
function parseItem(input) {
  const match = input.match(/^(\d+)[x,]?\s*(.+)$/i);
  return match ? `${match[1]}x ${match[2]}` : input;
}

// Create inner HTML for existing items
function createItemHTML(qty, name, checked) {
  return `
    <div class="item" draggable="true">
      <input type="checkbox" ${checked ? "checked" : ""} onchange="saveCurrentState()">
      <span>${qty}x ${name}</span>
      <button onclick="this.parentElement.remove(); saveCurrentState()">x</button>
    </div>
  `;
}

// Click pencil to edit previous
function focusPrevious(icon) {
  const prev = icon.previousElementSibling;
  if (prev && prev.isContentEditable) {
    prev.focus();
  }
}

// Enable drag and drop
function enableDrag(id) {
  const container = document.getElementById(`${id}-items`);
  const items = container.querySelectorAll(".item");

  items.forEach(item => {
    item.addEventListener("dragstart", () => {
      item.classList.add("dragging");
    });

    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      saveCurrentState();
    });

    item.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    item.addEventListener("drop", (e) => {
      e.preventDefault();
      const dragging = container.querySelector(".dragging");
      if (dragging && dragging !== item) {
        const bounding = item.getBoundingClientRect();
        const offset = e.clientY - bounding.top;
        if (offset > bounding.height / 2) {
          item.after(dragging);
        } else {
          item.before(dragging);
        }
      }
    });
  });
}

// Save state of all items/categories
function saveCurrentState() {
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

  lists[idx].categories = updatedCategories;
  localStorage.setItem("packlists", JSON.stringify(lists));
}
