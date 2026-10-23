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

const errName = document.getElementById("e-name");
const errCategory = document.getElementById("e-category");
const errPrice = document.getElementById("e-price");
const submitBtn = document.getElementById("modal-submit");

const regexName = /^.{3,30}$/;
const regexPrice = /^\d+(\.\d+)?$/;

function validateForm() {
  let isValid = true;

  // Nom
  if (regexName.test(inputName.value.trim())) {
    errName.textContent = "";
  } else {
    errName.textContent = "Le nom doit contenir entre 3 et 30 caractères.";
    isValid = false;
  }

  // Catégorie
  if (inputCategory.value !== "") {
    errCategory.textContent = "";
  } else {
    errCategory.textContent = "La catégorie est obligatoire.";
    isValid = false;
  }

  // Prix
  if (regexPrice.test(inputPrice.value) && Number(inputPrice.value) > 0) {
    errPrice.textContent = "";
  } else {
    errPrice.textContent = "Le prix doit être un nombre positif.";
    isValid = false;
  }

  submitBtn.disabled = !isValid;
}
inputName.addEventListener("input", validateForm);
inputCategory.addEventListener("change", validateForm);
inputPrice.addEventListener("input", validateForm);

function openModal() {
  overlay.classList.remove("hidden");
  overlay.classList.add("flex");
  submitBtn.disabled = true;
}

function closeModal() {
  overlay.classList.add("hidden");
  overlay.classList.remove("flex");
  form.reset();
  errName.textContent = "";
  errCategory.textContent = "";
  errPrice.textContent = "";
}

let nextId = 1;
const planningGrid = document.getElementById("planning-grid");
const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const newRecipe = {
  id: nextId,
  name: inputName.value.trim(),
  category: inputCategory.value,
  price: Number(inputPrice.value),
  diet: inputDiet.value,
  day: null,
};
nextId = nextId + 1;
refreshAll();
