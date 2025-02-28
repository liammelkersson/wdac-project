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
      let storeContainer = document.createElement("div");
      storeContainer.style.display = "flex";
      storeContainer.style.alignItems = "center";
      storeContainer.style.gap = "10px";

      let newLink = document.createElement("a");
      newLink.href = shop.url;
      newLink.target = "_blank";
      newLink.style.textDecoration = "none";
      newLink.style.color = "inherit";

      let newLi = document.createElement("div");
      newLi.innerText = shop.name;
      newLi.setAttribute("class", "store");

      let deleteButton = document.createElement("button");
      deleteButton.innerText = "delete";
      deleteButton.style.padding = "5px 10px";
      deleteButton.style.backgroundColor = "#ff4444";
      deleteButton.style.color = "white";
      deleteButton.style.border = "none";
      deleteButton.style.borderRadius = "5px";
      deleteButton.style.cursor = "pointer";

      deleteButton.addEventListener("click", () => {
        fetch(`http://localhost:3000/api/stores/${shop.id}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to delete store");
            }
            storeContainer.remove();
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Failed to delete store");
          });
      });

      newLink.appendChild(newLi);
      storeContainer.appendChild(newLink);
      storeContainer.appendChild(deleteButton);
      newUl.appendChild(storeContainer);
    });
  });
