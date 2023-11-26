const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealEle = document.getElementById("meals");
const resultHeading = document.getElementsByClassName("result-heading");
const single_mealEle = document.getElementById("single-meal");

//Search Meal
function searchMeal(e) {
  //once click submit button, The search bar will be clear.
  e.preventDefault();

  //clear single meal
  single_mealEle.innerHTML = "";

  //get search meal
  const searchedValue = search.value;

  //check for empty
  if (searchedValue.trim()) {
    fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchedValue}`
    )
      .then((res) => res.json())
      .then((data) => {
        resultHeading.innerHTML = `<h2>Search Result for ${searchedValue}</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<h2>There are no results for ${searchedValue}</h2>`;
        } else {
          mealEle.innerHTML = data.meals
            .map(
              (meal) => `
                  <div class="meal">
                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                  <div class="meal-info" data-mealid=${meal.idMeal}>
                  <h3> ${meal.strMeal}</h3>
                  </div>
                  </div>
                `
            )
            .join("");
        }
      });
  } else {
    alert("Please insert a value");
  }
}
//fetch meal by ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      const meal = data.meals[0];
      addMealToDom(meal);
    })
    .catch((error) => {
      console.error("Error fetching meal:", error);
    });
}

//Random Meal
function randomMeal() {
  mealEle.innerHTML = "";
  resultHeading.innerHTML = "";
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php
`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDom(meal);
    });
}
//add meal to DOM
function addMealToDom(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && measure) {
      ingredients.push(`${ingredient} - ${measure}`);
    } else {
      break;
    }
  }
  const mealHtml = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
  single_mealEle.innerHTML = mealHtml;
}

//Event Listener
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", randomMeal);
mealEle.addEventListener("click", (e) => {
  const mealInfo = e.composedPath().find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  // Rest of your code handling mealInfo

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});
