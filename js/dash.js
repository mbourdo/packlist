document.addEventListener('DOMContentLoaded', () => {
  const listGrid = document.getElementById('listGrid');
  const savedLists = JSON.parse(localStorage.getItem('packlists')) || [];

  // Add delete confirmation modal
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
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  let deleteIndex = null;
  const modal = document.getElementById('deleteModal');
  const cancelBtn = document.getElementById('cancelDelete');
  const confirmBtn = document.getElementById('confirmDelete');

  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    deleteIndex = null;
  });

  confirmBtn.addEventListener('click', () => {
    if (deleteIndex !== null) {
      savedLists.splice(deleteIndex, 1);
      localStorage.setItem('packlists', JSON.stringify(savedLists));
      location.reload();
    }
  });

  // Redirect to login when user icon is clicked
  const profileIcon = document.querySelector('.icon');
  if (profileIcon) {
    profileIcon.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  // Format ISO date to MM/DD/YYYY
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  savedLists.forEach((list, index) => {
    const card = document.createElement('div');
    card.className = 'card';
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

    // Entire card is clickable
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.menu-icon') && !e.target.closest('.context-menu')) {
        localStorage.setItem('currentIndex', index);
        window.location.href = 'list.html';
      }
    });

    // Show/hide menu
    const menu = card.querySelector('.context-menu');
    const menuIcon = card.querySelector('.menu-icon');
    menuIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.context-menu').forEach(m => m.classList.remove('active'));
      menu.classList.toggle('active');
    });
    document.body.addEventListener('click', () => {
      menu.classList.remove('active');
    });

    // Rename
    card.querySelector('.edit').addEventListener('click', (e) => {
      e.stopPropagation();
      const newName = prompt('Rename this list:', list.name);
      if (newName && newName.trim()) {
        savedLists[index].name = newName.trim();
        localStorage.setItem('packlists', JSON.stringify(savedLists));
        location.reload();
      }
    });

    // Print
    card.querySelector('.print').addEventListener('click', (e) => {
      e.stopPropagation();
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print - ${list.name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 2rem; }
              h1 { margin-bottom: 0.5rem; }
              h2 { margin-top: 2rem; }
            </style>
          </head>
          <body>
            <h1>${list.name}</h1>
            <p><strong>Destination:</strong> ${list.destination}</p>
            <p><strong>Dates:</strong> ${formatDate(list.startDate)} - ${formatDate(list.endDate)}</p>
            ${list.categories.map(cat => `
              <h2>${cat.title}</h2>
              <ul>
                ${cat.items.map(item => `<li>${item.qty}x ${item.name}</li>`).join('')}
              </ul>
            `).join('')}
            <script>window.onload = () => window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    });

    // Duplicate
    card.querySelector('.duplicate').addEventListener('click', (e) => {
      e.stopPropagation();
      const duplicated = { ...list, name: `${list.name} (Copy)` };
      savedLists.push(duplicated);
      localStorage.setItem('packlists', JSON.stringify(savedLists));
      location.reload();
    });

    // Delete
    card.querySelector('.delete').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteIndex = index;
      modal.style.display = 'flex';
    });

    listGrid.appendChild(card);
  });

  // Add New List card
  const newCard = document.createElement('div');
  newCard.className = 'card new-list';
  newCard.innerHTML = `
    <div class="new-list">
      <div>＋</div>
      <strong>New List</strong>
    </div>
  `;
  newCard.addEventListener('click', () => {
    window.location.href = 'setup.html';
  });
  listGrid.appendChild(newCard);
});
