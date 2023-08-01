import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Connecting the project firebase database
const appSettings = {
  databaseURL:
    "https://shoppingcart-45173-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Configuring the firebase databse
const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputField = document.getElementById("input-field");
const addButton = document.getElementById("add-button");
const clearButton = document.getElementById("clear-button");
const shoppingList = document.getElementById("shopping-list");
const tooltip = document.getElementById("tooltip");

// On button click call this function
addButton.addEventListener("click", function () {
  let inputValue = inputField.value;

  push(shoppingListInDB, inputValue); // Add the input value to the database
  tooltip.innerHTML = "Double click an item to remove it";
  clearInputField();
});

inputField.addEventListener("keydown", function (event) {
  // Check if the Enter key was pressed
  if (event.key === "Enter") {
    // Your action here
    let inputValue = inputField.value;

    push(shoppingListInDB, inputValue); // Add the input value to the database
    clearInputField();
  }
});

// On button click call this function
clearButton.addEventListener("click", function () {
  let itemsInDB = ref(database, `shoppingList/`);

  remove(itemsInDB);
});

// Using the firebase function 'onValue' to grab the snapshot of an item added to the database and append that item to the list in the browser
onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    // If there's a snapshot run this code

    let itemsArray = Object.entries(snapshot.val()); // convert list of objects to an array

    clearShoppingList();

    // Looping through each item in the database
    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];

      let currentItemID = currentItem[0]; // The key of the item
      let currentItemValue = currentItem[1]; // The value of the item

      // Add the current item to the list
      addItemToShoppingList(currentItem);
      tooltip.innerHTML = "Double click an item to remove it";
    }
  } else {
    shoppingList.innerHTML = "No items here... yet"; // Display this message when there's no items in the shopping list
    tooltip.innerHTML = "";
  }
});

// Clear tooltip
const clearTooltip = () => {
  tooltip.innerHTML = "";
};

// Clear items from the list
const clearShoppingList = () => {
  shoppingList.innerHTML = "";
};

// Clear the input value after pressing the button
const clearInputField = () => {
  inputField.value = "";
};

// Add items from the input into the list
function addItemToShoppingList(item) {
  let itemID = item[0]; // Item key
  let itemValue = item[1]; // Item value

  let newListElement = document.createElement("li"); // Create a new list element

  newListElement.textContent = itemValue; // Add the database value to the list element

  // The callback function will find the unique ID of the item clicked twice and then remove it
  newListElement.addEventListener("dblclick", function () {
    let locationOfItemInDB = ref(database, `shoppingList/${itemID}`);

    remove(locationOfItemInDB);
  });

  shoppingList.append(newListElement); // add item to list
}
