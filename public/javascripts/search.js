const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const resultsList = document.getElementById("results-list");

searchBtn.addEventListener("click", (e) => {
  searchShows(searchInput.value);
});

async function searchShows(query) {
  const url = `https://api.tvmaze.com/search/shows?q=${query}`;

  const res = await fetch(url);
  const resJson = await res.json();

  const results = resJson.map((showData) => {
    return {
      showName: showData.show.name,
      showId: showData.show.id,
    };
  });

  renderShows(results);
}

function renderShows(shows) {
  resultsList.innerHTML = "";

  shows.forEach((show) => {
    const listItem = document.createElement("li");
    const span = document.createElement("span");
    const addBtn = document.createElement("button");

    span.innerText = show.showName;
    addBtn.innerText = "add";

    addBtn.addEventListener("click", function btnHandler(e) {
      createShow({ title: show.showName, apiId: show.showId }, e.currentTarget);
    });

    listItem.appendChild(span);
    listItem.appendChild(addBtn);
    resultsList.appendChild(listItem);
  });
}

function createShow(show, btn) {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    console.log(this.responseText);
    btn.disabled = true;
  };

  xhttp.open("POST", "/shows");
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(`title=${show.title}&apiId=${show.apiId}`);
}
