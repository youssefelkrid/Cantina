let recipes = [];
let nextId = 1;
let days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
let MAX_PER_DAY = 50;

// je relie javascript avec html
let addbtn = document.getElementById("add-recipe-button");
let overlay = document.getElementById("modal-overlay");
let modalTitle = document.getElementById("modal-title");
let closeBtn = document.getElementById("modal-close");
let cancelBtn = document.getElementById("modal-cancel");
let form = document.getElementById("recipe-form");
let inputName = document.getElementById("f-name");
let inputCategory = document.getElementById("f-category");
let inputPrice = document.getElementById("f-price");
let inputDiet = document.getElementById("f-diet");
let submitBtn = document.getElementById("modal-submit");
let recipesGrid = document.getElementById("recipes-grid");
let planningGrid = document.getElementById("planning-grid");

let editingId = null;

function openModal(recipe) {
    if (recipe !== null) {
        editingId = recipe.id;
        modalTitle.textContent = "Modifier la recette";
        inputName.value = recipe.name;
        inputCategory.value = recipe.category;
        inputPrice.value = recipe.price;
        inputDiet.value = recipe.diet;
    } else {
        editingId = null;
        modalTitle.textContent = "Ajouter une recette";
    }
    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
}

function closeModel() {
    overlay.classList.add("hidden");
    overlay.classList.remove("flex");
    form.reset();
    editingId = null;
}

addbtn.addEventListener("click", function () {
    openModal(null);
});
closeBtn.addEventListener("click", closeModel);   // pour fermer la modal
cancelBtn.addEventListener("click", closeModel);  // bouton annuler


form.addEventListener("submit", function (e) {    // pour valider la recette
    e.preventDefault(); // pour arrêter le rechargement de la page
    let nameValue = inputName.value;
    let categoryValue = inputCategory.value;
    let priceValue = Number(inputPrice.value);
    let dietValue = inputDiet.value;

   
    if (nameValue === "" || categoryValue === "" || priceValue <= 0) {
        alert("S'il vous plait verifier le nom, la catégorie et le prix");
        return;
    }

    if (editingId === null) {
        let newRecipe = {
            id: nextId,
            name: nameValue,
            category: categoryValue,
            price: priceValue,
            diet: dietValue,
            day: null
        };
        recipes.push(newRecipe);
        nextId = nextId + 1;
        alert("Recette ajoutée avec succès");
    } else {
        alert("modification plus tard");
    }
    closeModel();
    console.log(recipes);
    renderRecipes();
    filleSelects();
    updateTotals();
    updateStats(); 
});

function renderRecipes() {
    recipesGrid.innerHTML = "";

    for (let i = 0; i < recipes.length; i++) {
        let recipe = recipes[i];

        
        if (recipe.day !== null) {
            continue;
        }

        let cardHtml = '<article class="rounded border bg-white p-4 mb-2">';
        cardHtml += '<h3 class="font-bold">' + recipe.name + '</h3>';
        cardHtml += '<p class="text-gray-600">' + recipe.category + '</p>';
        cardHtml += '<p class="text-blue-600 font-bold">' + recipe.price + ' DH</p>';
        cardHtml += '<span class="bg-gray-200 text-xs px-2 py-1 rounded">' + recipe.diet + '</span>';
        cardHtml += '</article>';

        recipesGrid.innerHTML = recipesGrid.innerHTML + cardHtml;
    }
}

function findRecipe(id) {
    for (let i = 0; i < recipes.length; i++) {
        if (recipes[i].id === id) {
            return recipes[i];
        }
    }
    return null;
}

function filleSelects() {
    let selects = document.querySelectorAll("#planning-grid select");
    for (let i = 0; i < selects.length; i++) {
        let select = selects[i];
        let day = select.dataset.day;
        let slot = select.dataset.slot;
        let htmlContent = '<option value="">En réserve</option>';

        for (let j = 0; j < recipes.length; j++) {
            let r = recipes[j];
            if (r.category === slot) {
                if (r.day === null || r.day === day) {
                    let isSelected = "";
                    if (r.day === day) {
                        isSelected = "selected";
                    }
                    htmlContent = htmlContent + '<option value="' + r.id + '" ' + isSelected + '>' + r.name + ' (' + r.price + ' DH)</option>';
                }
            }
        }
        select.innerHTML = htmlContent;
    }
}

function updateTotals() {
    for (let i = 0; i < days.length; i++) {
        let day = days[i];
        let dayTotal = 0;

        for (let j = 0; j < recipes.length; j++) {
            let r = recipes[j];
            if (r.day === day) {
                dayTotal = dayTotal + r.price;
            }
        }

        let totalElement = document.getElementById("total-" + day);
        if (totalElement !== null) {
            totalElement.textContent = dayTotal;
        }
    }
}


function updateStats() {
    let reserveCount = 0;
    let weekTotal = 0;
    let daysReady = 0;

    for (let i = 0; i < recipes.length; i++) {
        if (recipes[i].day === null) {
            reserveCount++;
        } else {
            weekTotal = weekTotal + recipes[i].price;
        }
    }

    
    for (let i = 0; i < days.length; i++) {
        for (let j = 0; j < recipes.length; j++) {
            if (recipes[j].day === days[i]) {
                daysReady++;
                break;
            }
        }
    }

    document.getElementById("stat-recipes").textContent = reserveCount;
    document.getElementById("stat-days").textContent = daysReady + " / 5";
    document.getElementById("stat-total").textContent = weekTotal + " DH / 250 DH";
}


planningGrid.addEventListener("change", function (e) {
    let select = e.target;

    if (select.tagName !== "SELECT") { 
        return;
    }

    let day = select.dataset.day;
    let slot = select.dataset.slot;

    if (select.value !== "") {
        let chosenRecipeId = Number(select.value);
        let chosenRecipe = findRecipe(chosenRecipeId);
        let totalWithoutThisSlot = 0;

        // addition du total
        for (let i = 0; i < recipes.length; i++) {
            let r = recipes[i];
        
            if (r.day === day && r.category !== slot) {
                totalWithoutThisSlot = totalWithoutThisSlot + r.price;
            }
        }

        // vérifier qu'on ne dépasse pas le budget de 50 DH
        if (totalWithoutThisSlot + chosenRecipe.price > MAX_PER_DAY) {
            alert("Tu as dépassé le prix maximal pour " + day + " !");
            filleSelects();
            return;
        }
    }

    // vider la place (enlever l'ancienne recette de ce slot)
    for (let i = 0; i < recipes.length; i++) {
        if (recipes[i].day === day && recipes[i].category === slot) {
            recipes[i].day = null;
        }
    }

    // relier la recette avec le jour
    if (select.value !== "") {
        let chosenRecipeId = Number(select.value);
        let chosenRecipe = findRecipe(chosenRecipeId);
        chosenRecipe.day = day;
    }

    // mettre à jour l'affichage
    filleSelects();
    renderRecipes();
    updateTotals(); 
    updateStats();  
});


planningGrid.addEventListener("click", function (e) {
    let btn = e.target;

    if (btn.dataset.action !== "clear-day") {
        return;
    }

    let day = btn.dataset.day;

    for (let i = 0; i < recipes.length; i++) {
        if (recipes[i].day === day) {
            recipes[i].day = null;
        }
    }

    filleSelects();
    renderRecipes();
    updateTotals();
    updateStats();
});