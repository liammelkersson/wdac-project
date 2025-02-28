// Function to handle store updates
function updateStore(id, formData) {
  return fetch(`http://localhost:3000/api/stores/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to update store');
    }
    return response.json();
  });
}

// Function to handle store creation
function createStore(formData) {
  return fetch('http://localhost:3000/api/stores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to create store');
    }
    return response.json();
  });
}

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

    // Create add store button and form
    let addContainer = document.createElement("div");
    addContainer.style.marginBottom = "20px";

    let addButton = document.createElement("button");
    addButton.innerText = "Add New Store";
    addButton.style.padding = "8px 16px";
    addButton.style.backgroundColor = "#4CAF50";
    addButton.style.color = "white";
    addButton.style.border = "none";
    addButton.style.borderRadius = "5px";
    addButton.style.cursor = "pointer";
    addButton.style.marginBottom = "10px";

    let addForm = document.createElement("form");
    addForm.style.display = "none";
    addForm.style.gap = "10px";
    addForm.style.flexDirection = "column";
    addForm.style.maxWidth = "300px";
    addForm.innerHTML = `
      <input type="text" name="name" placeholder="Store Name" required>
      <input type="url" name="url" placeholder="Store URL" required>
      <input type="text" name="district" placeholder="District" required>
      <div style="display: flex; gap: 10px;">
        <button type="submit">Save</button>
        <button type="button" class="cancel">Cancel</button>
      </div>
    `;

    addButton.addEventListener("click", () => {
      addForm.style.display = "flex";
      addButton.style.display = "none";
    });

    addForm.querySelector(".cancel").addEventListener("click", () => {
      addForm.style.display = "none";
      addButton.style.display = "block";
      addForm.reset();
    });

    addForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = {
        name: addForm.name.value,
        url: addForm.url.value,
        district: addForm.district.value
      };

      createStore(formData)
        .then((newStore) => {
          // Create new store element
          let storeContainer = document.createElement("div");
          storeContainer.style.display = "flex";
          storeContainer.style.alignItems = "center";
          storeContainer.style.gap = "10px";

          let newLink = document.createElement("a");
          newLink.href = newStore.url;
          newLink.target = "_blank";
          newLink.style.textDecoration = "none";
          newLink.style.color = "inherit";

          let newLi = document.createElement("div");
          newLi.innerText = newStore.name;
          newLi.setAttribute("class", "store");

          newLink.appendChild(newLi);
          storeContainer.appendChild(newLink);
          newUl.insertBefore(storeContainer, newUl.firstChild);

          // Reset and hide form
          addForm.reset();
          addForm.style.display = "none";
          addButton.style.display = "block";
        })
        .catch(error => {
          console.error("Error:", error);
          alert("Failed to create store");
        });
    });

    addContainer.appendChild(addButton);
    addContainer.appendChild(addForm);
    list.appendChild(addContainer);

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

      // Create edit button
      let editButton = document.createElement("button");
      editButton.innerText = "edit";
      editButton.style.padding = "5px 10px";
      editButton.style.backgroundColor = "#4CAF50";
      editButton.style.color = "white";
      editButton.style.border = "none";
      editButton.style.borderRadius = "5px";
      editButton.style.cursor = "pointer";
      editButton.style.marginRight = "5px";

      // Create edit form
      let editForm = document.createElement("form");
      editForm.style.display = "none";
      editForm.style.marginTop = "10px";
      editForm.style.gap = "10px";
      editForm.innerHTML = `
        <input type="text" name="name" value="${shop.name}" required>
        <input type="url" name="url" value="${shop.url}" required>
        <input type="text" name="district" value="${shop.district}" required>
        <button type="submit">Save</button>
        <button type="button" class="cancel">Cancel</button>
      `;

      editButton.addEventListener("click", () => {
        editForm.style.display = "flex";
        storeContainer.style.flexDirection = "column";
      });

      editForm.querySelector(".cancel").addEventListener("click", () => {
        editForm.style.display = "none";
        storeContainer.style.flexDirection = "row";
      });

      editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = {
          name: editForm.name.value,
          url: editForm.url.value,
          district: editForm.district.value
        };

        updateStore(shop.id, formData)
          .then(() => {
            newLi.innerText = formData.name;
            newLink.href = formData.url;
            editForm.style.display = "none";
            storeContainer.style.flexDirection = "row";
          })
          .catch(error => {
            console.error("Error:", error);
            alert("Failed to update store");
          });
      });

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
      storeContainer.appendChild(editButton);
      storeContainer.appendChild(deleteButton);
      storeContainer.appendChild(editForm);
      newUl.appendChild(storeContainer);
    });
  });
