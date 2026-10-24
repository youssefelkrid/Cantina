let recipes = [] ;
let nextId = 1;
let days = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi"];
let MAX_PER_DAY = 50 ; 

//je rele javascript avec html 
let addbtn = document.getElementById("add-recipe-button");
let overlay = document.getElementById("modal-overlay");
let modalTitle =  document.getElementById("modal-title");
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

function openModal(recipe){
    if(recipe !==null){
        editingId = recipe.id ;
        modalTitle.textContent = "Modifier la recette" ; 
        inputName.value = recipe.name ; 
        inputCategory.value = recipe.category;
        inputPrice.value = recipe.price;
        inputDiet.value = recipe.diet;
    }else{
        editingId= null ;
        modalTitle.textContent = "Ajouter une recette ";

    }
    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
}
function closeModel(){
    overlay.classList.add("hidden");
    overlay.classList.remove("flex");
    form.reset();
    editingId = null ;
}

addbtn.addEventListener("click", function(){
    openModal(null);
});
closeBtn.addEventListener("click" , closeModel); //pour fermer la case
cancelBtn.addEventListener("click",closeModel ); //c'est pour le botun cancal 


form.addEventListener("submit", function(e){     //pour valider la recette 
    e.preventDefault();// pour arrite la page Acctuiliser 
  let nameValue = inputName.value;
  let categoryValue = inputCategory.value;
  let priceValue = Number(inputPrice.value); 
  let dietValue = inputDiet.value;

  if(nameValue === "" || priceValue <=0){
    alert("S'il vous plait verfier le nom et price ");
    return ;
  }

  if(editingId === null){
    let newRecipe = {
        id : nextId ,
        name : nameValue ,
        category : categoryValue ,
        price : priceValue ,
        diet : dietValue ,
        day : null  
    };
    recipes.push(newRecipe); // en pue Ajouter les recette dans new tableau 
    nextId = nextId + 1 ; // et ses en puet donnier 1 a la recette et suivant prondre 2
    alert("succe la recette");
  }else{
    alert("modification plus tard")
  }
  closeModel();
  console.log(recipes) ;
  renderRecipes();
  filleSelects();

  


});

function renderRecipes(){
     recipesGrid.innerHTML = "";

    for(let i = 0 ; i<recipes.length ; i++) {
        let recipe = recipes[i];

        let cardHtml = '<article class="rounded border bg-white p-4 mb-2">';
    cardHtml += '<h3 class="font-bold">' + recipe.name + '</h3>';
    cardHtml += '<p class="text-gray-600">' + recipe.category + '</p>';
    cardHtml += '<p class="text-blue-600 font-bold">' + recipe.price + ' DH</p>';
    cardHtml += '<span class="bg-gray-200 text-xs px-2 py-1 rounded">' + recipe.diet + '</span>';
    
    cardHtml += '</article>';
     
    recipesGrid.innerHTML = recipesGrid.innerHTML + cardHtml ;
    }
}
 
function filleSelects() {
    let selects = document.querySelectorAll("#planning-grid select");
    for(let i=0 ;i <selects.length;i++ ){
        let select = selects[i];
        let day = select.dataset.day ; 
        let slot = select.dataset.slot ;
        let htmlContent = '<option value="">En réserve</option>';

        for(let j = 0 ; j < recipes.length;j++){
            let r = recipes[j];
            if(r.category === slot){

                if(r.day === null || r.day === day){
                    htmlContent = htmlContent + '<option value="' + r.id + '">' + r.name + ' (' + r.price + ' DH)</option>';
                }
            }
        }
        select.innerHTML = htmlContent;
    }
}