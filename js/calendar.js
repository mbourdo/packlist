const calendarGrid = document.querySelector('.calendar-grid');
const timeColumn = document.querySelector('.time-column');
const eventModal = document.getElementById('eventModal');
const eventNameInput = document.getElementById('eventName');
const eventItemsInput = document.getElementById('eventItems');
const saveEventButton = document.getElementById('saveEvent');
const cancelEventButton = document.getElementById('cancelEvent');

let startSlot = null; // Stores where the user starts dragging

// Generate Time Slots
document.addEventListener('DOMContentLoaded', () => {
  for (let i = 0; i < 12; i++) {
    const label = document.createElement('div');
    label.classList.add('time-label');
    label.innerText = `${i + 8}:00`;
    timeColumn.appendChild(label);
  }

  for (let i = 0; i < 7 * 12; i++) {
    const slot = document.createElement('div');
    slot.classList.add('time-slot');
    calendarGrid.appendChild(slot);

    // Drag start
    slot.addEventListener('mousedown', (e) => {
      startSlot = e.target;
      e.target.classList.add('highlight');
    });

    // Drag end
    slot.addEventListener('mouseup', (e) => {
      e.target.classList.remove('highlight');
      openEventModal(e.target);
    });
  }
});

// Open Event Modal
function openEventModal(slot) {
  eventModal.classList.remove('hidden');
  saveEventButton.onclick = () => saveEvent(slot);
  cancelEventButton.onclick = closeEventModal;
}

// Save Event
function saveEvent(slot) {
  const name = eventNameInput.value;
  const items = eventItemsInput.value;

  if (!name) return alert("Please enter an event name!");

  // Create Event Block
  const eventBlock = document.createElement('div');
  eventBlock.classList.add('event-block');
  eventBlock.innerText = `${name} \n(${items})`;
  slot.appendChild(eventBlock);

  closeEventModal();
}

// Close Modal
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
