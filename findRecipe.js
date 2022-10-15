const searchBtn = document.getElementById('search-btn')
const mealList = document.getElementById('meal')
const mealDetailsContent = document.querySelector('.meal-intructions-content')
const mealIngredientsContent = document.querySelector('.meal-ingredients-content')
const recipeCloseBtn = document.getElementById('recipe-close-btn')
const ingredientsCloseBtn = document.getElementById('ingredients-close-btn')

// Add event listener
var input = document.getElementById('search-input')
input.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    getRecipes()
  }
});

searchBtn.addEventListener('click', getRecipes) 
mealList.addEventListener('click', getMealRecipe)
recipeCloseBtn.addEventListener('click', () =>{
    mealDetailsContent.parentElement.classList.remove('showRecipe')
})
ingredientsCloseBtn.addEventListener('click', () =>{
    mealIngredientsContent.parentElement.classList.remove('showIngredients')
})


const apiKey = '29fdb3549a0e4975a7cca6cb2a387c24'

function getRecipes() {
    let searchInputText = document.getElementById("search-input").value.trim()
    const url = "https://api.spoonacular.com/recipes/findByIngredients"
    let n = 1
    axios.get(url, {
        params: {
            ingredients:  searchInputText,
            apiKey: apiKey
        }
    })
        .then(response => {
            console.log(response.data);
            let output = "" 
            if (response.data.length != 0) {
                response.data.forEach(meal => {
                    output += `
                                <div class="card mx-auto mb-3" data-id="${meal.id}" style="width: 25rem;">
                                <img src="${meal.image}" class="card-img-top" alt="...">
                                <div class="card-body">
                                    <h5 class="card-title">${meal.title}</h5>
                                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <a href="#" class="recipe-btn">Recipe</a>
                                    <a href="#" class="ingredients-btn">Ingredients</a>
                                    <button id="like-btn${n}" class="like-btn" onclick='change(event)'><i class="fa-brands fa-gratipay"></i></button>
                                </div>
                                </div>
                              `
                    
                    n += 1
                });

                mealList.classList.remove('notFound')
            } else {
                output = "Please enter a valid ingredient!"
                mealList.classList.add('notFound')
            }

            mealList.innerHTML = output
        })
        .catch( error => {
            console.log(error.message);
        });

}

function getMealRecipe(e) {
    e.preventDefault()
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement
        console.log(mealItem)

        let img = mealItem.getElementsByTagName('img')[0].src
        // console.log(img)
        let mealID = mealItem.dataset.id
        let recipeSummaryURL = `https://api.spoonacular.com/recipes/${mealID}/information?includeNutrition=false`

        axios.get(recipeSummaryURL, {
            params: {
                apiKey: apiKey
            }
        })
            .then(response => {
                // console.log(response.data);

                // TITLE
                let title = response.data.title
                // console.log(title)

                // SERVINGS INFO
                let servings = response.data.servings
                // console.log(servings)

                // PREP TIME
                let prepTime = response.data.readyInMinutes
                // console.log(prepTime)

                // SUMMARY INFO
                let summary = response.data.summary
                // console.log(summary)

                // INSTRUCTIONS INFO
                let recipeInstructionsArray = response.data.analyzedInstructions
                // console.log(recipeInstructionsArray)

                mealRecipeModel(title, servings, prepTime, recipeInstructionsArray, img)

            })
            .catch( error => {
                console.log(error.message);
            });

    } else if (e.target.classList.contains('ingredients-btn')) {
        let mealItem = e.target.parentElement.parentElement
        let mealID = mealItem.dataset.id
        let recipeSummaryURL = `https://api.spoonacular.com/recipes/${mealID}/information?includeNutrition=false`

        axios.get(recipeSummaryURL, {
            params: {
                apiKey: apiKey
            }
        })
            .then(response => {
                // INGREDIENTS
                let ingredientsArray = response.data.extendedIngredients
                mealIngredientsModel(ingredientsArray)
            })
            .catch( error => {
                console.log(error.message);
            });

    }

}

function mealIngredientsModel(ingredientsArray) {
    let output = `<h3 class="title">Ingredients</h3><ul class="fa-ul">`
    for (ingredient of ingredientsArray) {
        output += `<li> <i class="fa-solid fa-cart-shopping"></i><span class="ingredient">${ingredient.original}</span></li></li>`
    }

    output += "</ul>"
    mealIngredientsContent.innerHTML = output
    mealIngredientsContent.parentElement.classList.add('showIngredients')
}

// Function to display Recipe Instructions
function mealRecipeModel(title, servings, prepTime, recipeInstructionsArray, img) {
    meal = recipeInstructionsArray[0]

    let steps = meal.steps
    if (prepTime <= 0) {
        prepTime = 10
    }

    directionOutput = ""
    for (let step of steps) {
        directions = step.step
        stepNumber = step.number
        directionOutput += `
                            <p style="text-align: left;"><span style="font-weight: 500;">${stepNumber}</span>: ${directions}</p>
                            `
    }

    let output = `
                    <h2 class="recipe-title">${title}</h2>
                    <p class="recipe-category">Category Name</p>
                    <p class="recipe-time"><i class="fa-solid fa-clock"></i> <span id="time-required">${prepTime}</span></p>
                    <p class="recipe-servings"><i class="fa-solid fa-utensils"></i> <span id="servings">${servings}</span></p>

                    <div class="recipe-instruct">
                    <h3>Instructions</h3>
                    ${directionOutput}
                    </div>

                    <div class="recipe-meal-img">
                    <img src="${img}" alt="" class="img-fluid">
                    </div>
                 `
    
    mealDetailsContent.innerHTML = output
    mealDetailsContent.parentElement.classList.add('showRecipe')
}

// Change heart to red when user clicks it, then change it back when user clicks on it again
function change(event) {
    console.log(event.target.parentElement.id)
    likeButton = document.getElementById(event.target.parentElement.id)
    if (likeButton.style.color == "red") {
        likeButton.style.color = "grey"
    } else {
        likeButton.style.color = "red"
    }
}