// Make events draggable
const events = document.querySelectorAll('.draggable');
const timeSlots = document.querySelectorAll('.time-slot');

events.forEach(event => {
  event.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', event.innerText);
  });
});

// Allow dropping events into time slots
timeSlots.forEach(slot => {
  slot.addEventListener('dragover', (e) => {
    e.preventDefault();
    slot.classList.add('highlight');  // Highlight the drop target
  });

  slot.addEventListener('dragleave', () => {
    slot.classList.remove('highlight');
  });

  slot.addEventListener('drop', (e) => {
    e.preventDefault();
    slot.classList.remove('highlight');

    // Get dragged event text
    const eventText = e.dataTransfer.getData('text/plain');

    // Add event to calendar slot
    const newEvent = document.createElement('div');
    newEvent.classList.add('event');
    newEvent.innerText = eventText;
    slot.appendChild(newEvent);
  });
});

// Generate Time Slots Dynamically
document.addEventListener('DOMContentLoaded', () => {
  const calendarGrid = document.querySelector('.calendar-grid');
  for (let i = 0; i < 7 * 12; i++) {
    const slot = document.createElement('div');
    slot.classList.add('time-slot');
    calendarGrid.appendChild(slot);
  }
});
