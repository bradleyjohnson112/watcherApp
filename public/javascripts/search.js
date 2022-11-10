const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const resultsList = document.getElementById("results-list");
const errMsg = document.getElementById("err-msg");
let searchTimeoutToken = 0;
console.log(errMsg);

searchBtn.addEventListener("click", (e) => {
  /* Clear the timeout if it was set less than 250ms ago to
  ensure a 250ms delay between calls of searchShows (prevents spamming api requests) */
  clearTimeout(searchTimeoutToken);

  // Return if input is empty or just whitespace
  if (searchInput.value.trim().length === 0) {
    return;
  }

  searchTimeoutToken = setTimeout(() => {
    searchShows(searchInput.value);
  }, 250);
});

// Make GET request to api for shows matching the query
function searchShows(query) {
  const url = `https://api.tvmaze.com/search/shows?q=${query}`;

  fetch(url)
  .then((res) => res.json())
  // Data returned in format [{ score: 1.202817, show {...}}, {...}]
  .then((jsonData) => {
    // Add each shows name and id to obj in results array ex: [{ showName: "Breaking Bad", showId: 169}, {...}]
    const results = jsonData.map((showData) => {
      return {
        showName: showData.show.name,
        showId: showData.show.id,
      };
    });

    renderShows(results);
  })
  .catch((err) => {
    resultsList.innerHTML = "";
    errMsg.innerText = "Search failed, try again";
    errMsg.style.display = "block";
  });
}

// Creates li elements for each show and appends them to results-list
function renderShows(shows) {
  // Clear list and err message
  resultsList.innerHTML = "";
  errMsg.style.display = "none";

  // Create li with show name and add button for each show
  shows.forEach((show) => {
    const listItem = document.createElement("li");
    const span = document.createElement("span");
    const addBtn = document.createElement("button");

    span.innerText = show.showName;
    addBtn.innerText = "add";

    /* Sends POST request to /shows route when add button is clicked.
    This should save show in the db */
    addBtn.addEventListener("click", function btnHandler(e) {
      createShow({ title: show.showName, apiId: show.showId }, e.currentTarget);
    });

    // Append li to list
    listItem.appendChild(span);
    listItem.appendChild(addBtn);
    resultsList.appendChild(listItem);
  });
}

// Send POST request to watcherapp.co.uk/shows
function createShow(show, btn) {
  const xhr = new XMLHttpRequest();
  // On success
  xhr.onload = function () {
    // Disable button that called this function
    btn.disabled = true;
  };
  // On failure
  xhr.onerror = function () {
    console.log(this.responseText);
  };

  xhr.open("POST", "/shows");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(`title=${show.title}&apiId=${show.apiId}`);
}
