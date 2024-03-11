// Header search bar

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