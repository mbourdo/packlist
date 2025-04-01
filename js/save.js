// Load the current list by index
const idx = parseInt(localStorage.getItem('currentIndex'));
const packlists = JSON.parse(localStorage.getItem('packlists')) || [];
const currentList = packlists[idx];

// Show list name in confirmation
if (currentList && currentList.name) {
  const nameDisplay = document.getElementById('list-name');
  nameDisplay.textContent = currentList.name;
}

// Back button → return to setup
function goBack() {
  window.location.href = 'setup.html';
}
