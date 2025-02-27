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
      newLink.href = shop.url; //set the link
      newLink.target = "_blank"; //open in new tab (optional)
      newLink.style.textDecoration = "none"; //removes underline
      newLink.style.color = "inherit"; //keep default text color

      let newLi = document.createElement("div");
      newLi.innerText = shop.name;
      newLi.setAttribute("class", "store");

      newLink.appendChild(newLi); //wrap the div inside the anchor
      newUl.appendChild(newLink);
    });
  });
