document.addEventListener('DOMContentLoaded', () => {
    const tripDetails = document.getElementById('tripDetails');
    const itemInput = document.getElementById('itemInput');
    const addItemBtn = document.getElementById('addItemBtn');
    const itemQuantity = document.getElementById('itemQuantity');
    const itemCategory = document.getElementById('itemCategory');
    const subsections = document.getElementById('subsections');

    // Load trip details
    const destination = localStorage.getItem('destination') || "your trip";
    const startDate = new Date(localStorage.getItem('startDate')).toLocaleDateString('en-US');
    const endDate = new Date(localStorage.getItem('endDate')).toLocaleDateString('en-US');
    tripDetails.innerHTML = `Packing List for <span>${destination} (${startDate} - ${endDate})</span>`;

    // Load saved packing list items
    let items = JSON.parse(localStorage.getItem('packingList')) || [];
    initializeSubsections();
    items.forEach(item => addListItem(item));

    // Add item on button click
    addItemBtn.addEventListener('click', () => {
        addNewItem();
    });

    // Add item on Enter key press
    itemInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewItem();
        }
    });

    // Toggle between calendar and composite views
    const calendarViewBtn = document.getElementById('calendarViewBtn');
    const compositeViewBtn = document.getElementById('compositeViewBtn');

    calendarViewBtn.addEventListener('click', () => {
        window.location.href = 'calendar.html';
    });

    compositeViewBtn.addEventListener('click', () => {
        window.location.href = 'composite.html';
    });

    function addNewItem() {
        const newItem = itemInput.value.trim();
        const quantity = parseInt(itemQuantity.value) || 1;
        const category = itemCategory.value;

        if (newItem === "") return;

        // Check if item already exists in the same category
        const existingItem = items.find(item => item.name === newItem && item.category === category);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            items.push({ name: newItem, quantity, category });
        }

        localStorage.setItem('packingList', JSON.stringify(items));
        initializeSubsections();
        items.forEach(item => addListItem(item));
        itemInput.value = ""; // Clear input
        itemQuantity.value = 1; // Reset quantity
    }

    function initializeSubsections() {
        subsections.innerHTML = `
            <div class="subsection" id="Clothes">
                <h3>Clothes</h3>
                <ul id="ClothesList"></ul>
            </div>
            <div class="subsection" id="Toiletries">
                <h3>Toiletries</h3>
                <ul id="ToiletriesList"></ul>
            </div>
            <div class="subsection" id="Essentials">
                <h3>Essentials</h3>
                <ul id="EssentialsList"></ul>
            </div>
            <div class="subsection" id="Electronics">
                <h3>Electronics</h3>
                <ul id="ElectronicsList"></ul>
            </div>
            <div class="subsection" id="Accessories">
                <h3>Accessories</h3>
                <ul id="AccessoriesList"></ul>
            </div>
        `;
    }

    function addListItem(item) {
        const list = document.getElementById(`${item.category}List`);
        if (!list) return;

        // Remove existing item if it exists
        const existingLi = Array.from(list.children).find(li => li.innerText.includes(item.name));
        if (existingLi) existingLi.remove();

        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name} <span class="quantity">x${item.quantity}</span></span>
            <button class="delete-btn">&times;</button>
        `;

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            items = items.filter(i => i.name !== item.name || i.category !== item.category);
            localStorage.setItem('packingList', JSON.stringify(items));
            li.remove();
        });

        list.appendChild(li);
    }
});