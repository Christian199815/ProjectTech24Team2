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
    const groups = document.querySelectorAll('.ts-group');
    const leftArrow = document.querySelector('.ts-left-arrow-container');
    const rightArrow = document.querySelector('.ts-right-arrow-container');
    const indicatorsContainer = document.querySelector('.ts-navigation-indicators');

    let currentGroupIndex = 0;
    let indicators; // Define indicators variable

    // Options for the Intersection Observer
    const options = {
        threshold: 0.5 // Trigger when at least 50% of the element is visible
    };

    // Callback function for the Intersection Observer
    const callback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const groupIndex = Array.from(groups).indexOf(entry.target);
                currentGroupIndex = groupIndex;
                updateArrows();
                updateIndicator(groupIndex);
            }
        });
    };

    // Create Intersection Observer
    const observer = new IntersectionObserver(callback, options);

    // Observe each group
    groups.forEach(group => {
        observer.observe(group);
    });

    // Function to update indicators based on the current group index
    function updateIndicator(groupIndex) {
        indicators.forEach((indicator, index) => {
            if (index === groupIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // Function to handle indicator click
    function indicatorClickHandler(index) {
        groups[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }

    // Click event for left arrow
    leftArrow.addEventListener('click', function() {
        if (currentGroupIndex > 0) {
            currentGroupIndex--;
            groups[currentGroupIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
    });

    // Click event for right arrow
    rightArrow.addEventListener('click', function() {
        if (currentGroupIndex < groups.length - 1) {
            currentGroupIndex++;
            groups[currentGroupIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
    });

    // Function to add navigation indicators dynamically
    function addIndicators() {
        for (let i = 0; i < groups.length; i++) {
            const indicator = document.createElement('span');
            indicator.classList.add('ts-indicator');
            indicator.addEventListener('click', () => {
                indicatorClickHandler(i);
            });
            indicatorsContainer.appendChild(indicator);
        }
        // Redefine indicators after adding dynamically generated indicators
        indicators = document.querySelectorAll('.ts-indicator');
    }

    // Call the function to add indicators initially
    addIndicators();

    // Function to update arrows based on current group index
    function updateArrows() {
        leftArrow.style.visibility = currentGroupIndex === 0 ? 'hidden' : 'visible';
        rightArrow.style.visibility = currentGroupIndex === groups.length - 1 ? 'hidden' : 'visible';
    }

    // Initially update arrows
    updateArrows();
});




// =======================
// TRENDING MOVIE SLIDER
// =======================

document.addEventListener("DOMContentLoaded", function() {
    const slider = document.querySelector('.tm-slider');
    const groups = document.querySelectorAll('.tm-group');
    const leftArrow = document.querySelector('.tm-left-arrow-container');
    const rightArrow = document.querySelector('.tm-right-arrow-container');
    const indicatorsContainer = document.querySelector('.tm-navigation-indicators');

    let currentGroupIndex = 0;
    let indicators; // Define indicators variable

    // Options for the Intersection Observer
    const options = {
        threshold: 0.5 // Trigger when at least 50% of the element is visible
    };

    // Callback function for the Intersection Observer
    const callback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const groupIndex = Array.from(groups).indexOf(entry.target);
                currentGroupIndex = groupIndex;
                updateArrows();
                updateIndicator(groupIndex);
            }
        });
    };

    // Create Intersection Observer
    const observer = new IntersectionObserver(callback, options);

    // Observe each group
    groups.forEach(group => {
        observer.observe(group);
    });

    // Function to update indicators based on the current group index
    function updateIndicator(groupIndex) {
        indicators.forEach((indicator, index) => {
            if (index === groupIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // Function to handle indicator click
    function indicatorClickHandler(index) {
        groups[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }

    // Click event for left arrow
    leftArrow.addEventListener('click', function() {
        if (currentGroupIndex > 0) {
            currentGroupIndex--;
            groups[currentGroupIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
    });

    // Click event for right arrow
    rightArrow.addEventListener('click', function() {
        if (currentGroupIndex < groups.length - 1) {
            currentGroupIndex++;
            groups[currentGroupIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
    });

    // Function to add navigation indicators dynamically
    function addIndicators() {
        for (let i = 0; i < groups.length; i++) {
            const indicator = document.createElement('span');
            indicator.classList.add('tm-indicator');
            indicator.addEventListener('click', () => {
                indicatorClickHandler(i);
            });
            indicatorsContainer.appendChild(indicator);
        }
        // Redefine indicators after adding dynamically generated indicators
        indicators = document.querySelectorAll('.tm-indicator');
    }

    // Call the function to add indicators initially
    addIndicators();

    // Function to update arrows based on current group index
    function updateArrows() {
        leftArrow.style.visibility = currentGroupIndex === 0 ? 'hidden' : 'visible';
        rightArrow.style.visibility = currentGroupIndex === groups.length - 1 ? 'hidden' : 'visible';
    }

    // Initially update arrows
    updateArrows();
});





  
  
  
  
