window.addEventListener('DOMContentLoaded', function () {
    var castContainer = document.querySelector('.cast-container > div:nth-of-type(1)');
    var shadowLeft = document.querySelector('.shadow-left');
    var shadowRight = document.querySelector('.shadow-right');

    // Threshold for leniency
    var threshold = 50; // Adjust as needed

    // Function to toggle left gradient visibility and opacity
    function toggleLeftGradient() {
        if (castContainer.scrollLeft <= threshold) {
            shadowLeft.style.opacity = 0;
        } else {
            shadowLeft.style.opacity = 1;
        }
    }

    // Function to toggle right gradient visibility and opacity
    function toggleRightGradient() {
        if (castContainer.scrollLeft + castContainer.clientWidth >= castContainer.scrollWidth - threshold) {
            shadowRight.style.opacity = 0;
        } else {
            shadowRight.style.opacity = 1;
        }
    }

    // Add scroll event listener to the cast container
    castContainer.addEventListener('scroll', function () {
        toggleLeftGradient();
        toggleRightGradient();
    });

    // Call the toggle functions initially to set the initial state
    toggleLeftGradient();
    toggleRightGradient();
});
