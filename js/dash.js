document.addEventListener('DOMContentLoaded', () => {
  const listGrid = document.getElementById('listGrid');
  const savedLists = JSON.parse(localStorage.getItem('packlists')) || [];

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

  // Render all existing lists
  savedLists.forEach((list, index) => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <div class="title">${list.name} <span class="edit-icon">✏️</span></div>
      <div>${formatDate(list.startDate)} - ${formatDate(list.endDate)}</div>
      <div>${list.destination}</div>
      <span class="menu-icon">☰</span>
      <div class="context-menu">
        <button class="edit">Edit</button>
        <button class="print">Print</button>
        <button class="duplicate">Duplicate</button>
        <button class="delete">Delete</button>
      </div>
    `;

    // Menu interactions
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

    // Pencil and Edit button
    card.querySelector('.edit-icon').addEventListener('click', () => {
      localStorage.setItem('currentIndex', index);
      window.location.href = 'list.html';
    });
    card.querySelector('.edit').addEventListener('click', () => {
      localStorage.setItem('currentIndex', index);
      window.location.href = 'list.html';
    });

    // Print button
    card.querySelector('.print').addEventListener('click', () => {
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

    // Duplicate button
    card.querySelector('.duplicate').addEventListener('click', () => {
      const duplicated = { ...list, name: `${list.name} (Copy)` };
      savedLists.push(duplicated);
      localStorage.setItem('packlists', JSON.stringify(savedLists));
      location.reload();
    });

    // Delete button
    card.querySelector('.delete').addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this PackList? This action cannot be undone.')) {
        savedLists.splice(index, 1);
        localStorage.setItem('packlists', JSON.stringify(savedLists));
        location.reload();
      }
    });

    listGrid.appendChild(card);
  });

  // Add "New List" card
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

