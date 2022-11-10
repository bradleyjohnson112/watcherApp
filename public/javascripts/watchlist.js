const showsList = document.getElementById("shows-list");
const shows = JSON.parse(showData);

if(shows.length === 0) {
  document.querySelector("section p").style.display = "block";
} else {
  searchShows(shows);
}

function searchShows(shows) {
  const requests = [];
  shows.forEach((show) => {
    const url = `https://api.tvmaze.com/shows/${show.apiId}?embed[]=previousepisode&embed[]=nextepisode`;
    const req = fetch(url);
    requests.push(req);
  });

  Promise.all(requests)
  .then(responses => Promise.all(responses.map(res => res.json())))
  .then((shows) => {
    renderShows(shows);
  });
}

function renderShows(shows) {
  shows.forEach((show) => {
    const listItem = document.createElement("li");

    const img = document.createElement("img");
    show.image === null ? img.src = "../static/images/noimg.jpg" : img.src = show.image.medium;
    listItem.appendChild(img);

    const showInfo = document.createElement("div");
    showInfo.className = "show-info";
    listItem.appendChild(showInfo);

    const showName = document.createElement("span");
    showName.className = "show-name";
    showName.innerText = show.name;
    showInfo.appendChild(showName);

    const showStatus = document.createElement("span");
    showStatus.className = "show-status";
    showStatus.innerText = "Status: ";
    const actualStatus = document.createElement("span");
    actualStatus.className = show.status === "Running" ? "running" : "ended";
    actualStatus.innerText = show.status;
    showStatus.appendChild(actualStatus)
    showInfo.appendChild(showStatus);

    const episode = document.createElement("span");
    episode.className = "episode";
    const airtime = document.createElement("span");
    airtime.className = "airtime";
    if (show._embedded) {
      if (show._embedded.nextepisode) {
        episode.innerText = `Next Episode: ${show._embedded.nextepisode.name}`;
        airtime.innerHTML += formatDateTime(show._embedded.nextepisode.airstamp);
      } else {
        episode.innerText = `Last Episode: ${show._embedded.previousepisode.name}`;
        airtime.innerHTML = `Aired: ${formatDateTime(show._embedded.previousepisode.airstamp)}`;
      }
    } else {
        episode.innerText = "Show information not yet avaliable";
    }
    showInfo.appendChild(episode);
    showInfo.appendChild(airtime);

    const removeLink = document.createElement("a");
    removeLink.innerText = "remove";
    removeLink.href = `/shows/remove/${show.id}`;
    showInfo.appendChild(removeLink);

    showsList.appendChild(listItem);
  })
}

function formatDateTime(date) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dateTime = new Date(date);
  const dateString = `${dateTime.getUTCDate()} ${
    months[dateTime.getUTCMonth()]
  } ${dateTime.getUTCFullYear()} ${
    dateTime.getUTCHours() < 10
      ? "0" + dateTime.getUTCHours()
      : dateTime.getUTCHours()
  }:${
    dateTime.getUTCMinutes() < 10
      ? "0" + dateTime.getUTCMinutes()
      : dateTime.getUTCMinutes()
  }`;
  return dateString;
}
