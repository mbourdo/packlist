const calendarGrid = document.querySelector('.calendar-grid');
const timeColumn = document.querySelector('.time-column');
const weekdayGrid = document.querySelector('.weekday-grid');
const tripDestination = document.getElementById('tripDestination');
const weekRange = document.getElementById('weekRange');
const prevWeekBtn = document.getElementById('prevWeek');
const nextWeekBtn = document.getElementById('nextWeek');
const todayBtn = document.getElementById('todayBtn');

let isDragging = false;
let selectedEvent = null;
let currentDate = new Date();
let tripStart = new Date(localStorage.getItem('startDate'));
let tripEnd = new Date(localStorage.getItem('endDate'));

// Load trip destination and update week
document.addEventListener('DOMContentLoaded', () => {
  const destination = localStorage.getItem('destination') || "your trip";
  tripDestination.innerHTML = `Packing List for <span>${destination}</span>`;
  updateWeek();
  generateTimeLabels();
  generateTimeSlots();
});

// Generate time labels (6 AM - 8 PM)
function generateTimeLabels() {
  const times = ["6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "Noon", 
                 "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM"];
  times.forEach(time => {
    const label = document.createElement('div');
    label.classList.add('time-label');
    label.innerText = time;
    timeColumn.appendChild(label);
  });
}

// Generate time slots
function generateTimeSlots() {
  for (let i = 0; i < 7 * 15; i++) {
    const slot = document.createElement('div');
    slot.classList.add('time-slot');
    calendarGrid.appendChild(slot);

    // Click to create an event
    slot.addEventListener('click', (e) => {
      if (!isDragging) createEvent(e.target);
    });
  }
}

// Update the displayed week
function updateWeek() {
  const weekStart = new Date(currentDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  weekRange.innerText = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
  generateWeekdays(weekStart);
}

// Generate weekday names (Sun - Sat)
function generateWeekdays(weekStart) {
  weekdayGrid.innerHTML = ""; // Clear old days
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  for (let i = 0; i < 7; i++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    dayElement.innerText = `${days[i]} ${formatDate(new Date(weekStart.setDate(weekStart.getDate() + (i === 0 ? 0 : 1))))}`;
    weekdayGrid.appendChild(dayElement);
  }
}

// Move between weeks
prevWeekBtn.addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() - 7);
  updateWeek();
});

nextWeekBtn.addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() + 7);
  updateWeek();
});

todayBtn.addEventListener('click', () => {
  currentDate = new Date();
  updateWeek();
});

// Create a new event
function createEvent(slot) {
  const eventBlock = document.createElement('div');
  eventBlock.classList.add('event-block');
  eventBlock.innerText = "New Event";
  slot.appendChild(eventBlock);

  // Enable dragging to resize the event
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

// Format date like "Mar 10"
function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Toggle View
document.getElementById('calendarViewBtn').addEventListener('click', () => {
  window.location.href = 'calendar.html';
});

document.getElementById('compositeViewBtn').addEventListener('click', () => {
  window.location.href = 'composite.html';
});
