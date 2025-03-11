// Select the trip setup form
const tripForm = document.getElementById('tripForm');

tripForm?.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from reloading the page

    // Get user input values
    const destination = document.getElementById('destination').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const activities = document.getElementById('activities').value;

    // Store trip details in localStorage for later use in calendar view
    localStorage.setItem('destination', destination);
    localStorage.setItem('startDate', startDate);
    localStorage.setItem('endDate', endDate);
    localStorage.setItem('activities', activities);

    // Redirect user to Calendar View page
    window.location.href = 'calendar.html';
});
