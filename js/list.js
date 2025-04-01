// === Load saved list based on current index ===
const idx = localStorage.getItem("currentIndex");
const lists = JSON.parse(localStorage.getItem("packlists")) || [];
const saved = lists[idx];

const defaultCategories = ["Clothes", "Toiletries", "Essentials"];
let categoryCount = 0;

window.onload = () => {
  if (saved) {
    // === Set trip name, dates, and destination ===
    document.querySelector(".list-info h2").textContent = saved.name;
    document.querySelector(".list-info p:nth-of-type(1)").textContent =
      formatDate(saved.startDate) + " - " + formatDate(saved.endDate);
    document.querySelector(".list-info p:nth-of-type(2)").textContent =
      saved.destination;

    // === Load default categories ===
    defaultCategories.forEach(cat => addCategory(cat));
  }
};

// === Format ISO date to mm/dd/yyyy ===
function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

// === Navigate back to setup page ===
function goBack() {
  window.location.href = "setup.html";
}

// === Save trip and go to Save page ===
function saveList() {
  const name = document.querySelector(".list-info h2").textContent;
  localStorage.setItem("tripName", name);
  window.location.href = "save.html";
}

// === Add a new category ===
function addCategory(name = "New Category") {
  const id = `cat-${categoryCount++}`;
  const category = document.createElement("div");
  category.classList.add("category");
  category.setAttribute("data-id", id);

  category.innerHTML = `
  <div class="category-header">
    <div class="left-side">
      <button class="collapse-btn" onclick="toggleCollapse('${id}')">▾</button>
      <div class="cat-title-row">
        <h3 contenteditable="true">${name}</h3>
        <img src="assets/images/pencil-icon.png" class="edit-icon" alt="Edit">
      </div>
    </div>
    <button class="delete-btn" onclick="deleteCategory('${id}')">x</button>
  </div>
  <div class="items" id="${id}-items">
    <div class="add-item">
      <input type="text" placeholder="+ Add item (Quantity, Name)" 
             onkeypress="addItem(event, '${id}')">
    </div>
  </div>
`;



  document.getElementById("category-list").appendChild(category);
}

// === Collapse/expand category ===
function toggleCollapse(id) {
  const items = document.getElementById(`${id}-items`);
  items.classList.toggle("collapsed");
}

// === Delete a category ===
function deleteCategory(id) {
  const cat = document.querySelector(`[data-id="${id}"]`);
  if (cat && confirm("Delete this category?")) {
    cat.remove();
  }
}

// === Add an item when Enter key is pressed ===
function addItem(event, id) {
  if (event.key === "Enter") {
    event.preventDefault();
    const value = event.target.value.trim();
    if (!value) return;

    const item = document.createElement("div");
    item.className = "item";

    const parsed = parseItem(value);
    item.innerHTML = `
      <input type="checkbox">
      <span>${parsed}</span>
      <button onclick="this.parentElement.remove()">x</button>
    `;

    const container = document.getElementById(`${id}-items`);
    container.insertBefore(item, event.target.parentElement);
    event.target.value = "";
  }
}

// === Format item text to "2x Toothbrush" ===
function parseItem(input) {
  const match = input.match(/^(\d+)[x,]?\s*(.+)$/i);
  if (match) {
    const qty = match[1];
    const name = match[2];
    return `${qty}x ${name}`;
  }
  return input;
}

// === Focus on editable title text when clicking ✏️ ===
function focusTitle(pencil) {
  const title = pencil.previousElementSibling;
  title.focus();

  const range = document.createRange();
  range.selectNodeContents(title);
  range.collapse(false);

  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}
