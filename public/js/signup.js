function toggleGenre(event) {
  event.preventDefault();
  var divElement = event.target.closest('.genre-box');

  divElement.classList.toggle('genre-selected');

  
  var defaultImage = divElement.querySelector('img:not(.hidden)');
  var selectedImage = divElement.querySelector('.hidden');

  defaultImage.classList.toggle('hidden');
  selectedImage.classList.toggle('hidden');
}



function nextStep() {
  var currentStep = document.querySelector('.current-step');

  var nextStep = currentStep.nextElementSibling;

  if (nextStep) {
    currentStep.classList.remove('current-step');
    currentStep.classList.add('hidden');
    nextStep.classList.remove('hidden');
    nextStep.classList.add('current-step');
  }
}

function prevStep() {
  var currentStep = document.querySelector('.current-step');

  var prevStep = currentStep.previousElementSibling;

  if (prevStep) {
    currentStep.classList.remove('current-step');
    currentStep.classList.add('hidden');
    prevStep.classList.remove('hidden');
    prevStep.classList.add('current-step');
  }
}










// -------------------------------------
// -------------- slider ---------------
// -------------------------------------
window.onload = function () {
  slideOne();
  slideTwo();
  slideThree();
  slideFour();
  slideFive();
  slideSix();
  setInitialPositions();
  setDynamicValueIndicator();
};

// Define the function to set the dynamic value indicator
function setDynamicValueIndicator() {
  const slider5 = document.getElementById("slider-5");
  const valueSpan5 = document.getElementById("range5");

  slider5.addEventListener("input", function() {
    const value = parseInt(this.value);
    valueSpan5.textContent = value + " seasons";
  });

  const slider6 = document.getElementById("slider-6");
  const valueSpan6 = document.getElementById("range6");

  slider6.addEventListener("input", function() {
    const value = parseInt(this.value);
    valueSpan6.textContent = value + " seasons";
  });

  // Set initial values for the indicators
  const initialValue5 = parseInt(slider5.value);
  valueSpan5.textContent = initialValue5 + " seasons";

  const initialValue6 = parseInt(slider6.value);
  valueSpan6.textContent = initialValue6 + " seasons";
}

// Call the function to set the dynamic value indicators
setDynamicValueIndicator();




function setInitialPositions() {
  document.getElementById("value1").style.left = "26%";
  document.getElementById("value2").style.left = "74%";
  document.getElementById("value3").style.left = "26%";
  document.getElementById("value4").style.left = "50%";
  document.getElementById("value5").style.left = "31%";
  document.getElementById("value6").style.left = "69%";
}

let sliderOne = document.getElementById("slider-1");
let sliderTwo = document.getElementById("slider-2");
let displayValOne = document.getElementById("range1");
let displayValTwo = document.getElementById("range2");
let sliderTrack = document.querySelector(".slider-track");
let sliderMaxValue = document.getElementById("slider-1").max;

let sliderThree = document.getElementById("slider-3");
let sliderFour = document.getElementById("slider-4");
let displayValThree = document.getElementById("range3");
let displayValFour = document.getElementById("range4");
let sliderTrackTwo = document.querySelector(".slider-track-2");
let sliderMaxValueTwo = document.getElementById("slider-3").max;

let sliderFive = document.getElementById("slider-5");
let sliderSix = document.getElementById("slider-6");
let displayValFive = document.getElementById("range5");
let displayValSix = document.getElementById("range6");
let sliderTrackThree = document.querySelector(".slider-track-3");
let sliderMaxValueThree = document.getElementById("slider-5").max;

const rangePercentage = 0.95;

// Add input event listener to sliders
sliderOne.addEventListener('input', function() {
  slideOne();
});

sliderTwo.addEventListener('input', function() {
  slideTwo();
});

sliderThree.addEventListener('input', function() {
  slideThree();
});

sliderFour.addEventListener('input', function() {
  slideFour();
});

sliderFive.addEventListener('input', function() {
  slideFive();
});

sliderSix.addEventListener('input', function() {
  slideSix();
});

function slideOne() {
  let value = parseInt(sliderOne.value);
  let value2 = parseInt(sliderTwo.value);
  
  // Ensure sliderOne is less than sliderTwo
  if (value >= value2) {
    value = value2 - 1;
    sliderOne.value = value;
  }
  
  const percent = value / sliderMaxValue;
  const containerWidth = parseFloat(window.getComputedStyle(sliderOne.parentElement).getPropertyValue('width'));
  const availableWidth = containerWidth * rangePercentage; // Calculate available width
  const thumbOffset = percent * availableWidth + (containerWidth - availableWidth) / 2; // Adjust for equal reduction on both sides
  
  displayValOne.textContent = convertToTime(value); // Update display with time value
  displayValOne.parentElement.style.left = thumbOffset + 'px';
  fillColor();
}

function slideTwo() {
  let value = parseInt(sliderTwo.value);
  let value1 = parseInt(sliderOne.value);
  
  // Ensure sliderTwo is greater than sliderOne
  if (value <= value1) {
    value = value1 + 1;
    sliderTwo.value = value;
  }
  
  const percent = value / sliderMaxValue;
  const containerWidth = parseFloat(window.getComputedStyle(sliderTwo.parentElement).getPropertyValue('width'));
  const availableWidth = containerWidth * rangePercentage; // Calculate available width
  const thumbOffset = percent * availableWidth + (containerWidth - availableWidth) / 2; // Adjust for equal reduction on both sides
  
  displayValTwo.textContent = convertToTime(value); // Update display with time value
  displayValTwo.parentElement.style.left = thumbOffset + 'px';
  fillColor();
}

function slideThree() {
  let value = parseInt(sliderThree.value);
  let value1 = parseInt(sliderFour.value);
  
  // Ensure sliderThree is less than sliderFour
  if (value >= value1) {
    value = value1 - 1;
    sliderThree.value = value;
  }
  
  const percent = value / sliderMaxValueTwo;
  const containerWidth = parseFloat(window.getComputedStyle(sliderThree.parentElement).getPropertyValue('width'));
  const availableWidth = containerWidth * rangePercentage; // Calculate available width
  const thumbOffset = percent * availableWidth + (containerWidth - availableWidth) / 2; // Adjust for equal reduction on both sides
  
  displayValThree.textContent = convertToTime(value); // Update display with time value
  displayValThree.parentElement.style.left = thumbOffset + 'px';
  fillColorTwo();
}

function slideFour() {
  let value = parseInt(sliderFour.value);
  let value2 = parseInt(sliderThree.value);
  
  // Ensure sliderFour is greater than sliderThree
  if (value <= value2) {
    value = value2 + 1;
    sliderFour.value = value;
  }
  
  const percent = value / sliderMaxValueTwo;
  const containerWidth = parseFloat(window.getComputedStyle(sliderFour.parentElement).getPropertyValue('width'));
  const availableWidth = containerWidth * rangePercentage; // Calculate available width
  const thumbOffset = percent * availableWidth + (containerWidth - availableWidth) / 2; // Adjust for equal reduction on both sides
  
  displayValFour.textContent = convertToTime(value); // Update display with time value
  displayValFour.parentElement.style.left = thumbOffset + 'px';
  fillColorTwo();
}

function slideFive() {
  let value = parseInt(sliderFive.value);
  let value1 = parseInt(sliderSix.value);
  
  // Ensure sliderThree is less than sliderFour
  if (value >= value1) {
    value = value1 - 1;
    sliderFive.value = value;
  }
  
  const percent = value / sliderMaxValueThree;
  const containerWidth = parseFloat(window.getComputedStyle(sliderFive.parentElement).getPropertyValue('width'));
  const availableWidth = containerWidth * rangePercentage; // Calculate available width
  const thumbOffset = percent * availableWidth + (containerWidth - availableWidth) / 2; // Adjust for equal reduction on both sides
  
  displayValFive.textContent = convertToTime(value); // Update display with time value
  displayValFive.parentElement.style.left = thumbOffset + 'px';
  fillColorThree();
}

function slideSix() {
  let value = parseInt(sliderSix.value);
  let value2 = parseInt(sliderFive.value);
  
  // Ensure sliderFour is greater than sliderThree
  if (value <= value2) {
    value = value2 + 1;
    sliderSix.value = value;
  }
  
  const percent = value / sliderMaxValueThree;
  const containerWidth = parseFloat(window.getComputedStyle(sliderSix.parentElement).getPropertyValue('width'));
  const availableWidth = containerWidth * rangePercentage; // Calculate available width
  const thumbOffset = percent * availableWidth + (containerWidth - availableWidth) / 2; // Adjust for equal reduction on both sides
  
  displayValSix.textContent = convertToTime(value); // Update display with time value
  displayValSix.parentElement.style.left = thumbOffset + 'px';
  fillColorThree();
}

function fillColor() {
  const percent1 = (sliderOne.value / sliderMaxValue) * 100;
  const percent2 = (sliderTwo.value / sliderMaxValue) * 100;
  sliderTrack.style.background = `linear-gradient(to right, #A2BFFF ${percent1}% , #D6211F ${percent1}% , #D6211F ${percent2}%, #A2BFFF ${percent2}%)`;
}

function fillColorTwo() {
  const percent3 = (sliderThree.value / sliderMaxValueTwo) * 100;
  const percent4 = (sliderFour.value / sliderMaxValueTwo) * 100;
  sliderTrackTwo.style.background = `linear-gradient(to right, #A2BFFF ${percent3}% , #D6211F ${percent3}% , #D6211F ${percent4}%, #A2BFFF ${percent4}%)`;
}

function fillColorThree() {
  const percent3 = (sliderFive.value / sliderMaxValueThree) * 100;
  const percent4 = (sliderSix.value / sliderMaxValueThree) * 100;
  sliderTrackThree.style.background = `linear-gradient(to right, #A2BFFF ${percent3}% , #D6211F ${percent3}% , #D6211F ${percent4}%, #A2BFFF ${percent4}%)`;
}

function convertToTime(value) {
  // Convert value to hours and minutes
  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  // Format the time display
  let formattedTime = '';
  if (hours > 0) {
    formattedTime += hours + ' hrs';
    if (minutes > 0) {
      formattedTime += ' ' + minutes + ' min';
    }
  } else {
    formattedTime = minutes + ' min';
  }

  return formattedTime;
}


// Function to convert slider value to time format for the second slider
function convertSliderValueToTimeTwo(value) {
  const minutes = value;
  return `${minutes} mins`;
}

// Update slideFour function to use the new conversion function for the second slider
function slideFour() {
  let value = parseInt(sliderFour.value);
  let value2 = parseInt(sliderThree.value);

  // Ensure sliderFour is greater than sliderThree
  if (value <= value2) {
      value = value2 + 1;
      sliderFour.value = value;
  }

  const percent = value / sliderMaxValueTwo;
  const containerWidth = parseFloat(window.getComputedStyle(sliderFour.parentElement).getPropertyValue('width'));
  const availableWidth = containerWidth * rangePercentage; // Calculate available width
  const thumbOffset = percent * availableWidth + (containerWidth - availableWidth) / 2; // Adjust for equal reduction on both sides

  displayValFour.textContent = convertSliderValueToTimeTwo(value); // Use the new conversion function
  displayValFour.parentElement.style.left = thumbOffset + 'px';
  fillColorTwo();
}





