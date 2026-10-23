let recipes = [];

const addBtn = document.getElementById("add-recipe-button");
const overlay = document.getElementById("modal-overlay");
const closeBtn = document.getElementById("modal-close");
const cancelBtn = document.getElementById("modal-cancel");
const form = document.getElementById("recipe-form");
const recipesGrid = document.getElementById("recipes-grid");

const inputName = document.getElementById("f-name");
const inputCategory = document.getElementById("f-category");
const inputPrice = document.getElementById("f-price");
const inputDiet = document.getElementById("f-diet");

function openModal() {
  overlay.classList.remove("hidden");
  overlay.classList.add("flex");
}

function closeModal() {
  overlay.classList.add("hidden");
  overlay.classList.remove("flex");
  form.reset();
}

addBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

function renderRecipes() {
  recipesGrid.innerHTML = "";

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];

    recipesGrid.innerHTML += `
      <article class="rounded border bg-white p-4">
        <h3 class="font-bold">${recipe.name}</h3>
        <p>${recipe.category}</p>
        <p>${recipe.price} DH</p>
        <p>${recipe.diet}</p>
      </article>
    `;
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const newRecipe = {
    name: inputName.value,
    category: inputCategory.value,
    price: inputPrice.value,
    diet: inputDiet.value,
  };

  recipes.push(newRecipe);
  renderRecipes();
  closeModal();
});