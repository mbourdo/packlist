
const calendarGrid = document.querySelector('.calendar-grid');
const timeColumn = document.querySelector('.time-column');
const tripDestination = document.getElementById('tripDestination');

let isDragging = false;
let selectedEvent = null;

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
  for (let i = 0; i < 7 * 15; i++) {
    const slot = document.createElement('div');
    slot.classList.add('time-slot');
    calendarGrid.appendChild(slot);

    // Click to create an event
    slot.addEventListener('click', (e) => {
      if (!isDragging) createEvent(e.target);
    });
  }
});

// Create a new event
function createEvent(slot) {
  const eventBlock = document.createElement('div');
  eventBlock.classList.add('event-block');
  eventBlock.innerText = "New Event";
  slot.appendChild(eventBlock);

  // Start resizing event
  eventBlock.addEventListener('mousedown', (e) => {
    isDragging = true;
    selectedEvent = eventBlock;
    e.stopPropagation();
  });

  // Stop resizing event
  document.addEventListener('mouseup', () => {
    isDragging = false;
    selectedEvent = null;
  });

  // Resize the event by dragging
  document.addEventListener('mousemove', (e) => {
    if (isDragging && selectedEvent) {
      const newHeight = parseInt(selectedEvent.style.height || 60) + e.movementY;
      selectedEvent.style.height = `${Math.max(30, newHeight)}px`;
    }
  });
}

// Toggle View
document.getElementById('calendarViewBtn').addEventListener('click', () => {
  window.location.href = 'calendar.html';
});

document.getElementById('compositeViewBtn').addEventListener('click', () => {
  window.location.href = 'composite.html';
});
