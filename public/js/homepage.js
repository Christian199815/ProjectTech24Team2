// =======================
// FEATURED MOVIE SLIDER
// =======================

document.addEventListener("DOMContentLoaded", function() {
    const slider = document.querySelector('.fm-slider');
    const movies = document.querySelectorAll('.featured-movie');
    const leftArrow = document.querySelector('.fm-left-arrow-container');
    const rightArrow = document.querySelector('.fm-right-arrow-container');
    const indicatorsContainer = document.querySelector('.fm-navigation-indicators');

    let currentMovieIndex = 0;
    let indicators; // Define indicators variable

    // Options for the Intersection Observer
    const options = {
        threshold: 0.5 // Trigger when at least 50% of the element is visible
    };

    // Callback function for the Intersection Observer
    const callback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const movieIndex = Array.from(movies).indexOf(entry.target);
                currentMovieIndex = movieIndex;
                updateArrows();
                updateIndicator(movieIndex);
            }
        });
    };

    // Create Intersection Observer
    const observer = new IntersectionObserver(callback, options);

    // Observe each movie
    movies.forEach(movie => {
        observer.observe(movie);
    });

    // Function to update arrows based on current movie index
    function updateArrows() {
        leftArrow.style.visibility = currentMovieIndex === 0 ? 'hidden' : 'visible';
        rightArrow.style.visibility = currentMovieIndex === movies.length - 1 ? 'hidden' : 'visible';
    }

    // Function to update indicators based on the current movie index
    function updateIndicator(movieIndex) {
        indicators.forEach((indicator, index) => {
            if (index === movieIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // Function to handle indicator click
    function indicatorClickHandler(index) {
        movies[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }

    // Click event for left arrow
    leftArrow.addEventListener('click', function() {
        if (currentMovieIndex > 0) {
            currentMovieIndex--;
            movies[currentMovieIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
    });

    // Click event for right arrow
    rightArrow.addEventListener('click', function() {
        if (currentMovieIndex < movies.length - 1) {
            currentMovieIndex++;
            movies[currentMovieIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
    });

    // Function to add navigation indicators dynamically
    function addIndicators() {
        for (let i = 0; i < movies.length; i++) {
            const indicator = document.createElement('span');
            indicator.classList.add('fm-indicator');
            indicator.addEventListener('click', () => {
                indicatorClickHandler(i);
            });
            indicatorsContainer.appendChild(indicator);
        }
        // Redefine indicators after adding dynamically generated indicators
        indicators = document.querySelectorAll('.fm-indicator');
    }

    // Call the function to add indicators initially
    addIndicators();

    // Initially update arrows
    updateArrows();
});






// =======================
// TRENDING SHOW SLIDER
// =======================

document.addEventListener("DOMContentLoaded", function() {
    const slider = document.querySelector('.ts-slider');
    const leftArrow = document.querySelector('.ts-left-arrow-container');
    const rightArrow = document.querySelector('.ts-right-arrow-container');
    const indicatorsContainer = document.querySelector('.ts-navigation-indicators');

    let currentStep = 0;
    const stepWidth = slider.offsetWidth; // Width of each step
    const stepSize = stepWidth * 0.8; // 80% of the slider width as step size

    // Function to update arrows and indicators
    function updateNavigation() {
        const maxStep = Math.floor(slider.scrollWidth / stepSize) - 1; // Maximum step index
        currentStep = Math.min(currentStep, maxStep); // Ensure currentStep does not exceed maxStep
        leftArrow.style.visibility = currentStep > 0 ? 'visible' : 'hidden';
        rightArrow.style.visibility = currentStep < maxStep ? 'visible' : 'hidden';
        // Clear existing indicators
        indicatorsContainer.innerHTML = '';
        // Create new indicators
        for (let i = 0; i <= maxStep; i++) {
            const indicator = document.createElement('span');
            indicator.classList.add('ts-indicator');
            indicator.classList.toggle('active', i === currentStep);
            indicator.addEventListener('click', () => {
                currentStep = i;
                updateNavigation();
                scrollToStep(currentStep);
            });
            indicatorsContainer.appendChild(indicator);
        }
    }

    // Function to scroll to a specific step
    function scrollToStep(step) {
        const scrollLeft = step * stepSize;
        slider.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }

    // Click event for left arrow
    leftArrow.addEventListener('click', function() {
        if (currentStep > 0) {
            currentStep--;
            updateNavigation();
            scrollToStep(currentStep);
        }
    });

    // Click event for right arrow
    rightArrow.addEventListener('click', function() {
        const maxStep = Math.floor(slider.scrollWidth / stepSize) - 1;
        if (currentStep < maxStep) {
            currentStep++;
            updateNavigation();
            scrollToStep(currentStep);
        }
    });

    // Scroll event to handle navigation when scrolling with touchpad or similar devices
    slider.addEventListener('scroll', function() {
        currentStep = Math.round(slider.scrollLeft / stepSize);
        updateNavigation();
    });

    // Initial update of arrows and indicators
    updateNavigation();
});








// =======================
// TRENDING MOVIE SLIDER
// =======================

document.addEventListener("DOMContentLoaded", function() {
    const slider = document.querySelector('.tm-slider');
    const leftArrow = document.querySelector('.tm-left-arrow-container');
    const rightArrow = document.querySelector('.tm-right-arrow-container');
    const indicatorsContainer = document.querySelector('.tm-navigation-indicators');

    let currentStep = 0;
    const stepWidth = slider.offsetWidth; // Width of each step
    const stepSize = stepWidth * 0.8; // 80% of the slider width as step size

    // Function to update arrows and indicators
    function updateNavigation() {
        const maxStep = Math.floor(slider.scrollWidth / stepSize) - 1; // Maximum step index
        currentStep = Math.min(currentStep, maxStep); // Ensure currentStep does not exceed maxStep
        leftArrow.style.visibility = currentStep > 0 ? 'visible' : 'hidden';
        rightArrow.style.visibility = currentStep < maxStep ? 'visible' : 'hidden';
        // Clear existing indicators
        indicatorsContainer.innerHTML = '';
        // Create new indicators
        for (let i = 0; i <= maxStep; i++) {
            const indicator = document.createElement('span');
            indicator.classList.add('tm-indicator');
            indicator.classList.toggle('active', i === currentStep);
            indicator.addEventListener('click', () => {
                currentStep = i;
                updateNavigation();
                scrollToStep(currentStep);
            });
            indicatorsContainer.appendChild(indicator);
        }
    }

    // Function to scroll to a specific step
    function scrollToStep(step) {
        const scrollLeft = step * stepSize;
        slider.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }

    // Click event for left arrow
    leftArrow.addEventListener('click', function() {
        if (currentStep > 0) {
            currentStep--;
            updateNavigation();
            scrollToStep(currentStep);
        }
    });

    // Click event for right arrow
    rightArrow.addEventListener('click', function() {
        const maxStep = Math.floor(slider.scrollWidth / stepSize) - 1;
        if (currentStep < maxStep) {
            currentStep++;
            updateNavigation();
            scrollToStep(currentStep);
        }
    });

    // Scroll event to handle navigation when scrolling with touchpad or similar devices
    slider.addEventListener('scroll', function() {
        currentStep = Math.round(slider.scrollLeft / stepSize);
        updateNavigation();
    });

    // Initial update of arrows and indicators
    updateNavigation();
});







  
  
  
  
