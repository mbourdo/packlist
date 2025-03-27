const idx = localStorage.getItem('currentIndex');
const saved = JSON.parse(localStorage.getItem('packlists'))[idx];
document.getElementById('listName').textContent = saved.name;
