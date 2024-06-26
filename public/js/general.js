// -----------------Header hamburger-----------------

var menuButton = document.querySelector("header .hamburger");
var navMenu = document.querySelector("nav");
var deHeader = document.querySelector("header");
var body = document.body;


document.getElementById('hamburger-toggle')
.addEventListener('click', function(){
  document.body.classList.toggle('nav-open');
});

function toggleMenu() {
  navMenu.classList.toggle("open");
  deHeader.classList.toggle("open");
  body.classList.toggle("scroll-lock"); // scroll-lock
}

menuButton.onclick = toggleMenu;



// -----------------Header search bar-----------------

// document.getElementById("searchInput").addEventListener("keypress", function (event) {
//   if (event.key === "Enter") {
//     event.preventDefault();
//     searchFunction();
//   }
// });

// function searchFunction() {
//   var searchQuery = document.getElementById("searchInput").value;
//   console.log("Search query: " + searchQuery);
// }



// -----------------Like knop-----------------

const likeButtons = document.querySelectorAll('.likeButton');
likeButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    if (this.src.includes('header-favorite.svg')) {
      this.src = 'images/header-favorite_2.svg';
    } else {
      this.src = 'images/header-favorite.svg';
    }
  });
});
