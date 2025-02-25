fetch("http://localhost:3000/api/stores")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    return response.json();
  })
  .then((data) => {
    console.log("GET response data:", data);
    let list = document.querySelector("#listOfStores");
    let newUl = document.createElement("div");
    newUl.setAttribute("class", "storeDiv");
    list.appendChild(newUl);

    data.forEach((shop) => {
      let newLink = document.createElement("a");
      let shopUrl = shop.url.startsWith("http") ? shop.url : `https://${shop.url}`;
      newLink.href = shopUrl;
      newLink.target = "_blank"; // opens in new tab
      newLink.style.textDecoration = "none"; // removes underline
      newLink.style.color = "inherit"; // keeps default text color

      let newLi = document.createElement("div");
      newLi.innerText = shop.name;
      newLi.setAttribute("class", "store");

      newLink.appendChild(newLi); // wraps the div inside the anchor
      newUl.appendChild(newLink);
    });
  });
