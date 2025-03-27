const defaultCategories = ["Clothes", "Toiletries", "Essentials"];
let categoryCount = 0;

window.onload = () => {
  defaultCategories.forEach(cat => addCategory(cat));
};

function goBack() {
  window.history.back();
}

function saveList() {
  alert("List saved.");
}

function addCategory(name = "New Category") {
  const id = `cat-${categoryCount++}`;
  const category = document.createElement("div");
  category.classList.add("category");
  category.setAttribute("data-id", id);

  category.innerHTML = `
    <div class="category-header">
      <button class="collapse-btn" onclick="toggleCollapse('${id}')">▾</button>
      <h3 contenteditable="true">${name}</h3>
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

function toggleCollapse(id) {
  const items = document.getElementById(`${id}-items`);
  items.classList.toggle("collapsed");
}

function deleteCategory(id) {
  const cat = document.querySelector(`[data-id="${id}"]`);
  if (cat && confirm("Delete this category?")) {
    cat.remove();
  }
}

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

function parseItem(input) {
  const match = input.match(/^(\d+)[x,]?\s*(.+)$/i);
  if (match) {
    const qty = match[1];
    const name = match[2];
    return `${qty}x ${name}`;
  }
  return input;
}
