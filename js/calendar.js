const calendarGrid = document.querySelector('.calendar-grid');
const weekdayGrid = document.querySelector('.weekday-grid');
const tripDestination = document.getElementById('tripDestination');

// Load trip destination
document.addEventListener('DOMContentLoaded', () => {
  const destination = localStorage.getItem('destination') || "your trip";
  tripDestination.innerHTML = `Packing List for <span>${destination}</span>`;
  generateWeekdays();
  generateTimeSlots();
  enableDragAndDrop();
});

// Generate weekday headers
function generateWeekdays() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  days.forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    dayElement.innerText = day;
    weekdayGrid.appendChild(dayElement);
  });
}

// Generate time slots
function generateTimeSlots() {
  for (let i = 0; i < 7 * 15; i++) {
    const slot = document.createElement('div');
    slot.classList.add('time-slot');
    calendarGrid.appendChild(slot);
  }
}

// Enable drag and drop
function enableDragAndDrop() {
  const events = document.querySelectorAll('.draggable');

  events.forEach(event => {
    event.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', event.innerText);
    });
  });

  const timeSlots = document.querySelectorAll('.time-slot');

  timeSlots.forEach(slot => {
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      const eventText = e.dataTransfer.getData('text/plain');
      const newEvent = document.createElement('div');
      newEvent.classList.add('event-block');
      newEvent.innerText = eventText;
      slot.appendChild(newEvent);
    });
  });
}
