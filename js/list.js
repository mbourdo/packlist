const container = document.getElementById('listContainer');
const index = localStorage.getItem('currentIndex');
const lists = JSON.parse(localStorage.getItem('packlists')) || [];
const list = lists[index];

function renderList() {
  container.innerHTML = `<h2 contenteditable="true">${list.name}</h2><p>${list.startDate} - ${list.endDate}</p><p>${list.destination}</p>`;

  list.categories.forEach((cat, i) => {
    const catDiv = document.createElement('div');
    catDiv.innerHTML = `<h3>${cat.title}</h3>`;

    cat.items.forEach(item => {
      const p = document.createElement('p');
      p.textContent = `${item.qty}x ${item.name}`;
      catDiv.appendChild(p);
    });

    const input = document.createElement('input');
    input.placeholder = 'Add item (Quantity, Name)';
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const [qty, ...rest] = input.value.split(/x|,| /);
        const name = rest.join(' ').trim();
        list.categories[i].items.push({ qty, name });
        input.value = '';
        renderList();
      }
    });
    catDiv.appendChild(input);
    container.appendChild(catDiv);
  });
}

document.getElementById('saveButton').onclick = function () {
  lists[index] = list;
  localStorage.setItem('packlists', JSON.stringify(lists));
  window.location.href = 'save.html';
};

renderList();
