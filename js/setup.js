document.getElementById('setupForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const list = {
      name: document.getElementById('listName').value,
      destination: document.getElementById('destination').value,
      startDate: document.getElementById('startDate').value,
      endDate: document.getElementById('endDate').value,
      categories: [
        { title: 'Clothes', items: [] },
        { title: 'Toiletries', items: [] },
        { title: 'Essentials', items: [] }
      ]
    };
  
    const packlists = JSON.parse(localStorage.getItem('packlists')) || [];
    packlists.push(list);
    localStorage.setItem('packlists', JSON.stringify(packlists));
    localStorage.setItem('currentIndex', packlists.length - 1);
    window.location.href = 'list.html';
  });