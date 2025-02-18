//fetch request

fetch("http://localhost:3000/api/shops")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    return response.json();
  })
  .then((data) => {
    console.log("GET response data:", data);
    let list = document.querySelector("#listOfShops");
    let newUl = document.createElement("div");
    list.appendChild(newUl);
    data.forEach((shop) => {
      let newLi = document.createElement("div");
      newLi.innerText = shop.name;
      newLi.setAttribute("class", "shop");
      //new_li.classList.add("listItem")
      newUl.appendChild(newLi);
    });
  });
