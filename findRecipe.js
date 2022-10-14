const searchBtn = document.getElementById('search-btn')
const mealList = document.getElementById('meal')
const mealDetailsContent = document.querySelector('.meal-intructions-content')
const recipeCloseBtn = document.getElementById('recipe-close-btn')

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

const apiKey = '29fdb3549a0e4975a7cca6cb2a387c24'

function getRecipes() {
    let searchInputText = document.getElementById("search-input").value.trim()
    const url = "https://api.spoonacular.com/recipes/findByIngredients"

    axios.get(url, {
        params: {
            ingredients:  searchInputText,
            apiKey: apiKey
        }
    })
        .then(response => {
            console.log(response.data);
            let output = "" 
            if (response.data) {
                response.data.forEach(meal => {
                    output += `
                                <div class="card mx-auto mb-3" data-id="${meal.id}" style="width: 25rem;">
                                <img src="${meal.image}" class="card-img-top" alt="...">
                                <div class="card-body">
                                    <h5 class="card-title">${meal.title}</h5>
                                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <a href="#" class="recipe-btn">Recipe</a>
                                    <a href="#" class="ingredients-btn">Ingredients</a>
                                </div>
                                </div>
                              `
                });
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

        let mealID = mealItem.dataset.id
        const recipeSummaryURL = `https://api.spoonacular.com/recipes/${mealID}/information?includeNutrition=false`

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

                mealRecipeModel(title, servings, prepTime, recipeInstructionsArray)

            })
            .catch( error => {
                console.log(error.message);
            });
    }

}

// Function to display Recipe Instructions
function mealRecipeModel(title, servings, prepTime, recipeInstructionsArray) {
    meal = recipeInstructionsArray[0]
    let steps = meal.steps

    if (prepTime <= 0) {
        prepTime = 10
    }

    directionOutput = ""
    for (let step of steps) {
        directions = step.step
        stepNumber = step.number
        console.log(step.step)
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
                    <img src="" alt="" class="img-fluid">
                    </div>

                    <div class="recipe-link">
                    <a href="#" target="_blank">Watch Video</a>
                    </div>
                 `
    
    mealDetailsContent.innerHTML = output
    mealDetailsContent.parentElement.classList.add('showRecipe')
}


// Retrieve recipes using EDAMAME
// function getRecipes() {
//     const url = "https://api.edamam.com/search"
//     const app_id = "ccc48ec6"
//     const app_key = "403e0be9ff6f16af44eb087dffa518ae"
//     var q = document.getElementById("search-input").value.trim()

//     axios.get(url, {
//         params: {
//             q: q,
//             app_id: app_id,
//             app_key: app_key
//         }
//     })
//     .then(response => {
//         console.log(response.data);
//         var recipes = response.data.hits
//         var output = ""

//         for (let recipe of recipes) {
//             let label = recipe.recipe.label
//             let img = recipe.recipe.image
//             let recipeURL = recipe.recipe.url

//             let card = `
//                         <div class="card mx-auto mb-3" style="width: 25rem;">
//                         <img src="${img}" class="card-img-top" alt="...">
//                         <div class="card-body">
//                             <h5 class="card-title">${label}</h5>
//                             <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//                             <a href="${recipeURL}" class="recipe-btn">Recipe</a>
//                             <a href="#" class="recipe-btn">Ingredients</a>
//                         </div>
//                         </div>
//                         `
//             output += card
//         }
        
//         document.getElementById("meal").innerHTML = output
//     })
//     .catch( error => {
//         console.log(error.message);
//     });
// }

