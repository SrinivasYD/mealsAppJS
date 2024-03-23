// Mapping all the elements of HTML to the variables
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const mealDetail = document.getElementById("mealDetail");
const favoriteMeals = document.getElementById("favoriteMeals");

// Load favorite meals from local storage
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Adding event listener to the search input
searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value.trim();

  if (searchValue.length > 0) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`)
      .then((response) => response.json())
      .then((data) => {
        displaySearchResults(data.meals || []);
      })
      .catch((error) => console.error("Error:", error));
  } else {
    searchResults.innerHTML = "";
    mealDetail.innerHTML = "";
  }
});

// Function to display search results
function displaySearchResults(meals) {
  searchResults.innerHTML = "";
  meals.forEach((meal) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <p>${meal.strMeal}</p>
      <button onclick="addToFavorites('${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}')">Add to Favorites</button>
      <button onclick="showMealDetail('${meal.idMeal}')">View Details</button>
    `;
    searchResults.appendChild(li);
  });
}

// Function to show meal details in a new page
function showMealDetail(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((response) => response.json())
    .then((data) => {
      const meal = data.meals[0];
      const mealDetailPage = `
        <html>
          <head>
            <title>${meal.strMeal}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
              }
              img {
                max-width: 100%;
                height: auto;
              }
            </style>
          </head>
          <body>
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <p>${meal.strInstructions}</p>
            <a href="javascript:window.close()">Close</a>
          </body>
        </html>
      `;
      const mealDetailWindow = window.open(
        "",
        "_blank",
        "width=600,height=400"
      );
      mealDetailWindow.document.open();
      mealDetailWindow.document.write(mealDetailPage);
      mealDetailWindow.document.close();
    })
    .catch((error) => console.error("Error:", error));
}

// Function to add the meal to the favourites
function addToFavorites(mealId, mealName, mealThumb) {
  if (!favorites.some((meal) => meal.id === mealId)) {
    favorites.push({ id: mealId, name: mealName, thumb: mealThumb });
    alert("Added to favourites");
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavoriteMeals();
  }
}

// Function to display the favourite meals
function displayFavoriteMeals() {
  favoriteMeals.innerHTML = "";
  favorites.forEach((favorite) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${favorite.thumb}" alt="${favorite.name}">
      <p>${favorite.name}</p>
      <button onclick="removeFromFavorites('${favorite.id}')">Remove from Favorites</button>
    `;
    favoriteMeals.appendChild(li);
  });
}

// Function to remove the meal from favourites list
function removeFromFavorites(mealId) {
  favorites = favorites.filter((meal) => meal.id !== mealId);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert("Removed from favourites");
  displayFavoriteMeals();
}

// Initial display of favorite meals
displayFavoriteMeals();
