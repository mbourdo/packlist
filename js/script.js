// Select form and list options section
const tripForm = document.getElementById('tripForm');
const listOptions = document.getElementById('listOptions');

// Event listener for trip setup form submission
tripForm?.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents page reload

    // Get user input values
    const destination = document.getElementById('destination').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const activities = document.getElementById('activities').value;

    // Save trip data to localStorage (to be used later in Calendar/Composite views)
    localStorage.setItem('destination', destination);
    localStorage.setItem('startDate', startDate);
    localStorage.setItem('endDate', endDate);
    localStorage.setItem('activities', activities);

    // Show packing list options after form is submitted
    listOptions.classList.remove('hidden');
});

// Button navigation for list type selection
document.getElementById('calendarViewBtn')?.addEventListener('click', function() {
    window.location.href = 'calendar-view.html'; // Redirects to Calendar View page
});

document.getElementById('compositeViewBtn')?.addEventListener('click', function() {
    window.location.href = 'composite-list.html'; // Redirects to Composite List page
});
