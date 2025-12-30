$(document).ready(function () {
  const grid = $("#favoritesGrid");

  function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  }

  function setFavorites(favs) {
    localStorage.setItem("favorites", JSON.stringify(favs));
  }

  function renderFavorites() {
    const favorites = getFavorites();
    grid.empty();
    if (favorites.length === 0) {
      grid.html(`<div class="p-6 text-center">No favorite meals yet. Go add some! ❤️</div>`);
      return;
    }

    favorites.forEach(meal => {
      const tile = `<article class="fav-tile" data-id="${meal.idMeal}">
          <div class="fav-thumb"
            style="background-image:url('${meal.strMealThumb}')">
          </div>
          <div class="fav-name">${meal.strMeal}</div>
          <div class="fav-cat">${meal.strCategory}</div>
          <button class="remove-btn" data-id="${meal.idMeal}" onclick="return confirm('Are you sure you want to remove this meal?');">
            Remove
          </button>
        </article>`;
      grid.append(tile);
    });

  }

  grid.on("click", ".remove-btn", function () {
    const id = $(this).data("id");
    let favorites = getFavorites();
    favorites = favorites.filter(meal => meal.idMeal !== String(id));
    setFavorites(favorites);
    renderFavorites();
  })

  grid.on("click", ".fav-thumb", ".fav-name", function () {
    const id = $(this).closest(".fav-tile").data("id");

    localStorage.setItem("mealId", id);
    window.location.href = "meal.html";
  })
  renderFavorites();
});