
document.getElementById("searchInput").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchFunction();
  }
});

function searchFunction() {
  var searchQuery = document.getElementById("searchInput").value;
  console.log("Search query: " + searchQuery);
}


function toggleGenre(event) {
  event.preventDefault(); // Prevent default link behavior
  var divElement = event.target.closest('.genre-box'); // Find the closest div element with the class 'genre-box'

  // Toggle the 'genre-selected' class on the clicked div
  divElement.classList.toggle('genre-selected');

  // Find the images inside the genre-box
  var defaultImage = divElement.querySelector('img:not(.hidden)');
  var selectedImage = divElement.querySelector('.hidden');

  // Toggle the visibility of the images
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