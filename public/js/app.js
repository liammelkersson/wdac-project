//fetch request
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
    list.appendChild(newUl);
    data.forEach((shop) => {
      let newLi = document.createElement("div");
      newLi.innerText = shop.name;
      newLi.setAttribute("class", "store");
      //new_li.classList.add("listItem")
      newUl.appendChild(newLi);
    });
  });
