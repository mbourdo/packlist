const calendarGrid = document.querySelector('.calendar-grid');
const weekdayGrid = document.querySelector('.weekday-grid');
const tripDestination = document.getElementById('tripDestination');
const weekRange = document.getElementById('weekRange');

// Load trip destination
document.addEventListener('DOMContentLoaded', () => {
  const destination = localStorage.getItem('destination') || "your trip";
  tripDestination.innerHTML = `Packing List for <span>${destination}</span>`;
  generateWeekdays();
  generateTimeSlots();
  updateWeekRange();
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
  for (let i = 0; i < 7 * 24; i++) { // 7 days, 24 hours per day
    const slot = document.createElement('div');
    slot.classList.add('time-slot');
    calendarGrid.appendChild(slot);
  }
}

// Update week range based on trip dates
function updateWeekRange() {
  const startDate = localStorage.getItem('startDate');
  const endDate = localStorage.getItem('endDate');
  if (startDate && endDate) {
    const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    weekRange.innerText = `${start} - ${end}`;
  } else {
    weekRange.innerText = "Loading...";
  }
}

// Toggle between calendar and composite views
const calendarViewBtn = document.getElementById('calendarViewBtn');
const compositeViewBtn = document.getElementById('compositeViewBtn');

calendarViewBtn.addEventListener('click', () => {
  window.location.href = 'calendar.html';
});

compositeViewBtn.addEventListener('click', () => {
  window.location.href = 'composite.html';
});

document.addEventListener('DOMContentLoaded', () => {
  const tripDestination = document.getElementById('tripDestination');
  const tripDateRange = document.getElementById('tripDateRange');
  const weekRange = document.getElementById('weekRange');

  // Load trip details
  const destination = localStorage.getItem('destination') || "your trip";
  const startDate = new Date(localStorage.getItem('startDate'));
  const endDate = new Date(localStorage.getItem('endDate'));

  // Format date range
  const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const dateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  // Update header
  tripDestination.innerText = destination;
  tripDateRange.innerText = dateRange;
  weekRange.innerText = dateRange;

  // Rest of the calendar.js code...
});