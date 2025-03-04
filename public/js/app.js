// function that handles store updates (EDIT)
function updateStore(id, formData) {
  return fetch(`http://localhost:3000/api/stores/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to update store");
    }
    return response.json();
  });
}

// function that handles store creation (ADD)
function createStore(formData) {
  return fetch("http://localhost:3000/api/stores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to create store");
    }
    return response.json();
  });
}

// fetches and displays stores
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
    addButton.classList.add("add-store-btn");
    addButton.style.display = "none"; // initially hidden

    let addForm = document.createElement("form");
    addForm.style.display = "none";
    addForm.innerHTML = `
      <input type="text" name="name" placeholder="Store Name" required>
      <input type="url" name="url" placeholder="Store URL" required>
      <input type="text" name="district" placeholder="District" required>
      <button type="submit">Save</button>
      <button type="button" class="cancel">Cancel</button>
    `;

    // Add these event listeners
    addButton.addEventListener("click", () => {
      addForm.style.display = "block";
    });

    addForm.querySelector(".cancel").addEventListener("click", () => {
      addForm.style.display = "none";
    });

    addForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = {
        name: addForm.name.value,
        url: addForm.url.value,
        district: addForm.district.value,
      };

      createStore(formData)
        .then((newStore) => {
          createStoreElement(newStore, newUl);
          addForm.reset();
          addForm.style.display = "none";
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to create store");
        });
    });

    addContainer.appendChild(addButton);
    addContainer.appendChild(addForm);
    list.appendChild(addContainer);

    // sorting controls
    let sortingContainer = document.createElement("div");
    sortingContainer.style.marginBottom = "20px";
    sortingContainer.style.display = "flex";
    sortingContainer.style.gap = "10px";

    let nameSort = document.createElement("select");
    nameSort.innerHTML = `
      <option value="">Sort by Name</option>
      <option value="asc">A to Z</option>
      <option value="desc">Z to A</option>
    `;

    let districtSort = document.createElement("select");
    districtSort.innerHTML = `
      <option value="">Sort by District</option>
      <option value="asc">District (A to Z)</option>
      <option value="desc">District (Z to A)</option>
    `;

    sortingContainer.appendChild(nameSort);
    sortingContainer.appendChild(districtSort);
    list.insertBefore(sortingContainer, addContainer);

    // sorting
    nameSort.addEventListener("change", () => {
      const sortOrder = nameSort.value;
      if (sortOrder) {
        const storeElements = Array.from(newUl.children);
        storeElements.sort((a, b) => {
          const nameA = a.querySelector(".store").innerText.toLowerCase();
          const nameB = b.querySelector(".store").innerText.toLowerCase();
          return sortOrder === "asc"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        });
        storeElements.forEach((element) => newUl.appendChild(element));
        districtSort.value = ""; // resetting
      }
    });

    districtSort.addEventListener("change", () => {
      const sortOrder = districtSort.value;
      if (sortOrder) {
        const storeElements = Array.from(newUl.children);
        storeElements.sort((a, b) => {
          const districtA = a
            .querySelector('form input[name="district"]')
            .value.toLowerCase();
          const districtB = b
            .querySelector('form input[name="district"]')
            .value.toLowerCase();
          return sortOrder === "asc"
            ? districtA.localeCompare(districtB)
            : districtB.localeCompare(districtA);
        });
        storeElements.forEach((element) => newUl.appendChild(element));
        nameSort.value = ""; // resetting
      }
    });

    let newUl = document.createElement("div");
    newUl.setAttribute("class", "storeDiv");
    list.appendChild(newUl);

    // creating store elements
    data.forEach((shop) => createStoreElement(shop, newUl));
  });

// Function to create store elements
function createStoreElement(shop, parentElement) {
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
  newLi.innerHTML = `${
    shop.name
  }<br><span style="font-size: 0.8em; color: #666;">${
    shop.district || "Other"
  }</span>`;
  newLi.setAttribute("class", "store");

  // create edit button
  let editButton = document.createElement("button");
  editButton.innerText = "edit";
  editButton.classList.add("edit-store-btn");
  editButton.style.display = "none";

  // create delete button
  let deleteButton = document.createElement("button");
  deleteButton.innerText = "delete";
  deleteButton.classList.add("delete-store-btn");
  deleteButton.style.display = "none";

  // Edit form
  let editForm = document.createElement("form");
  editForm.style.display = "none";
  editForm.innerHTML = `
    <input type="text" name="name" value="${shop.name}" required>
    <input type="url" name="url" value="${shop.url}" required>
    <input type="text" name="district" value="${shop.district}" required>
    <button type="submit">Save</button>
    <button type="button" class="cancel">Cancel</button>
  `;

  editButton.addEventListener("click", () => {
    editForm.style.display = "flex";
  });

  editForm.querySelector(".cancel").addEventListener("click", () => {
    editForm.style.display = "none";
  });

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = {
      name: editForm.name.value,
      url: editForm.url.value,
      district: editForm.district.value,
    };

    updateStore(shop.id, formData)
      .then(() => {
        newLi.innerText = formData.name;
        newLink.href = formData.url;
        editForm.style.display = "none";
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to update store");
      });
  });

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
  parentElement.appendChild(storeContainer);
}

// Toggle visibility of buttons using the checkbox
document.addEventListener("DOMContentLoaded", function () {
  const toggleSwitch = document.getElementById("toggleSwitch");

  function toggleButtons() {
    const displayValue = toggleSwitch.checked ? "inline-block" : "none";

    document
      .querySelectorAll(".add-store-btn")
      .forEach((btn) => (btn.style.display = displayValue));
    document
      .querySelectorAll(".edit-store-btn")
      .forEach((btn) => (btn.style.display = displayValue));
    document
      .querySelectorAll(".delete-store-btn")
      .forEach((btn) => (btn.style.display = displayValue));
  }

  // Initially hide buttons
  toggleButtons();

  // Listen for checkbox changes
  toggleSwitch.addEventListener("change", toggleButtons);
});

