const calendarGrid = document.querySelector('.calendar-grid');
const timeColumn = document.querySelector('.time-column');
const tripDestination = document.getElementById('tripDestination');

const eventModal = document.getElementById('eventModal');
const eventNameInput = document.getElementById('eventName');
const eventItemsInput = document.getElementById('eventItems');
const saveEventButton = document.getElementById('saveEvent');
const cancelEventButton = document.getElementById('cancelEvent');

let startSlot = null;

// Load trip destination from localStorage
document.addEventListener('DOMContentLoaded', () => {
  const destination = localStorage.getItem('destination') || "your trip";
  tripDestination.innerHTML = `Packing List for <span>${destination}</span>`;

  // Generate time labels (6 AM - 8 PM)
  const times = ["6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "Noon", 
                 "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM"];
  times.forEach(time => {
    const label = document.createElement('div');
    label.classList.add('time-label');
    label.innerText = time;
    timeColumn.appendChild(label);
  });

  // Generate time slots
  for (let i = 0; i < 7 * 14; i++) {
    const slot = document.createElement('div');
    slot.classList.add('time-slot');
    calendarGrid.appendChild(slot);

    // Dragging logic
    slot.addEventListener('mousedown', (e) => {
      startSlot = e.target;
      e.target.classList.add('highlight');
    });

    slot.addEventListener('mouseup', (e) => {
      e.target.classList.remove('highlight');
      openEventModal(e.target);
    });
  }
});

// Open event modal
function openEventModal(slot) {
  eventModal.classList.remove('hidden');
  saveEventButton.onclick = () => saveEvent(slot);
  cancelEventButton.onclick = closeEventModal;
}

// Save event
function saveEvent(slot) {
  const name = eventNameInput.value;
  const items = eventItemsInput.value;

  if (!name) return alert("Please enter an event name!");

  const eventBlock = document.createElement('div');
  eventBlock.classList.add('event-block');
  eventBlock.innerText = `${name} \n(${items})`;
  slot.appendChild(eventBlock);

  closeEventModal();
}

// Close modal
function closeEventModal() {
  eventModal.classList.add('hidden');
  eventNameInput.value = "";
  eventItemsInput.value = "";
}

// Toggle View
document.getElementById('calendarViewBtn').addEventListener('click', () => {
  window.location.href = 'calendar.html';
});

document.getElementById('compositeViewBtn').addEventListener('click', () => {
  window.location.href = 'composite.html';
});
