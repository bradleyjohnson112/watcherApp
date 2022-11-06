const listItems = document.querySelectorAll("ul li");
listItems.forEach((li) => {
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

  const span = li.children[1].querySelector("#airtime").children[0];
  const airTime = new Date(span.textContent);
  const dateString = `${airTime.getUTCDate()} ${
    months[airTime.getUTCMonth()]
  } ${airTime.getUTCFullYear()} ${
    airTime.getUTCHours() < 10
      ? "0" + airTime.getUTCHours()
      : airTime.getUTCHours()
  }:${
    airTime.getUTCMinutes() < 10
      ? "0" + airTime.getUTCMinutes()
      : airTime.getUTCMinutes()
  }`;
  span.textContent = dateString;
});
