$(document).ready(function () {
  const container = $(".meal-card");
  const mealID = localStorage.getItem("mealId");

  if (!mealID) {
    alert("No meal found. Please generate a meal first.");
    window.location.href = "index.html";
    return;
  }

  function fetchMealByID(id) {
    return $.ajax({
      url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
      method: "GET",
      dataType: "json",
    });
  }

  function getIngridients(meal) {
    let list = "";

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== "") {
        list += `${measure} ${ingredient} <br>`;
      }
    }
    return list;
  }
  container.html(`<div class="p-6 text-center">Loading recipe...</div>`);
  fetchMealByID(mealID).done(function (data) {
    const meal = data.meals[0];
    const card = `<div id="detailImage" class="detail-hero"
          style="background-image:url('${meal.strMealThumb}')"></div>

        <div class="detail-body">
          <div class="detail-title" id="detailName">${meal.strMeal}</div>
          <div class="detail-category" id="detailCategory">${meal.strCategory}</div>
          <div class="detail-section">
            <h4>Ingredients</h4>
            <div class="detail-text" id="detailIngredients">
            ${getIngridients(meal)}
            </div>
          </div>

          <div class="detail-section">
            <h4>Recipe</h4>
            <div class="detail-text" id="detailInstructions">
            ${meal.strInstructions}
            </div>
          </div>

          <a href="index.html" class="back-btn">Back to Home</a>
        </div>`

    container.html(card);

  });
});