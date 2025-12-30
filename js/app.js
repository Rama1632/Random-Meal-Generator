$(document).ready(function () {
  const container = $("#mealContainer");

  function fetchRandomMeal() {
    return $.ajax({
      url: "https://www.themealdb.com/api/json/v1/1/random.php",
      method: "GET",
      dataType: "json",
    });
  }

  function renderMealCard(meal) {
    const card = `
      <article class="meal-card show">
        <div class="meal-hero"
          style="background-image:url('${meal.strMealThumb}')">
        </div>

        <div class="meal-body">
          <div class="meal-title">${meal.strMeal}</div>
          <div class="meal-category">${meal.strCategory}</div>

          <a class="see-recipe" href="meal.html">See Recipe</a>

          <div class="action-row">
            <button id="generateBtn" class="btn generate">Generate</button>
            <button id="addFavoriteBtn" class="btn fav">Add to Favorites</button>
          </div>
        </div>
      </article>
    `;

    container.html(card);
  }

  function showMeal(meal) {
    localStorage.setItem("mealId", meal.idMeal);
    localStorage.setItem("lastMeal", JSON.stringify(meal));
    renderMealCard(meal);
  }

  function loadLastMeal() {
    const saved = localStorage.getItem("lastMeal");
    if (saved) {
      showMeal(JSON.parse(saved));
    } else {
      fetchRandomMeal().done(res => showMeal(res.meals[0]));
    }
  }

  // Event delegation (VERY IMPORTANT)
  container.on("click", "#generateBtn", function () {
    fetchRandomMeal().done(res => showMeal(res.meals[0]));
  });

  container.on("click", ".see-recipe", function () {
    // mealId already saved
  });

  loadLastMeal();

  function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  }

  function setFavorites(favs) {
    localStorage.setItem("favorites", JSON.stringify(favs));
  }

  container.on("click", "#addFavoriteBtn", function () {
    const lastMeal = JSON.parse(localStorage.getItem("lastMeal"));
    if (!lastMeal) {
      alert("No meal to add. Please generate a meal first.");
      return;
    }
    let favorites = getFavorites();
    const exists = favorites.some(meal => meal.idMeal === lastMeal.idMeal);
    if (exists) {
      alert("Meal is already in favorites ❤️.");
      return;
    }
    favorites.push({
      idMeal: lastMeal.idMeal,
      strMeal: lastMeal.strMeal,
      strMealThumb: lastMeal.strMealThumb,
      strCategory: lastMeal.strCategory
    });

    setFavorites(favorites);
    alert("Meal added to favorites! ❤️");
  })

  const selectCategory = $("#categorySelect"), searchBtn = $("#searchBtn");

  function loadCategories() {
    $.ajax({
      url: "https://www.themealdb.com/api/json/v1/1/list.php?c=list",
      method: "GET",
      dataType: "json",
      success: function (res) {
        res.meals.forEach(cat => {
          selectCategory.append(
            `<option value="${cat.strCategory}">${cat.strCategory}</option>`
          );
        });
      }
    });
  }

  function fetchMealById(id) {
    $.ajax({
      url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
      method: "GET",
      dataType: "json",
      success: function (data) {
        const meal = data.meals[0];
        showMeal(meal);
      }
    })
  }

  searchBtn.on("click", function () {
    const category = selectCategory.val();
    if (!category) {
      alert("Please select a category to search.");
      return;
    }

    $.ajax({
      url: `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
      method: "GET",
      dataType: "json",
      success: function (res) {
        const meals = res.meals;
        const randomMeal = meals[Math.floor(Math.random() * meals.length)];

        fetchMealById(randomMeal.idMeal);
      }
    })
  })
  loadCategories();
  loadLastMeal();
});
