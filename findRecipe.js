// const apiKey = '29fdb3549a0e4975a7cca6cb2a387c24'
// const apiKey = 'bfdf9716b064437383509f5530dcfde9'
const apiKey = 'bfdf9716b064437383509f5530dcfde9'

const mealList = document.getElementById('meal')
const mealDetailsContent = document.querySelector('.meal-intructions-content')
const mealIngredientsContent = document.querySelector('.meal-ingredients-content')
const recipeCloseBtn = document.getElementById('recipe-close-btn')
const ingredientsCloseBtn = document.getElementById('ingredients-close-btn')
// let likedRecipes = JSON.parse(localStorage.getItem('likedRecipes'))
// if (likedRecipes === null) {
//     localStorage.setItem('likedRecipes', '[]')
// }

const app = Vue.createApp({
    data() {
        return {
            tempIngredients: '',
            ingredients: []
        }
    }, 

    methods: {
        addIngredients(e) {
            if (e.key === 'Enter' && this.tempIngredients) {
                if (!this.ingredients.includes(this.tempIngredients)) {
                    
                    this.ingredients.push(this.tempIngredients)

                    axios.get('https://api.edamam.com/api/food-database/v2/parser', {
                        params: {
                            app_id: 'c45c7e6e',
                            app_key: 'bdafa1941074f5dd5b3ac569a0ed0d60',
                            ingr: this.tempIngredients

                        }
                    })
                        .then(response => {
                            // console.log(response.data);
                            let output = ""
                            if (response.data.parsed.length == 0) {
                                output += `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                                <strong>Holy guacamole!</strong> You should enter only valid ingredients.
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                              </div>`
                                // alert('Please Enter A Valid Ingredient')
                                // console.log(this.ingredients)
                                mealList.innerHTML = output
                                this.deleteIngredient(this.ingredients[this.ingredients.length - 1])
                            }
                        })
                        .catch( error => {
                            console.log(error.message);
                        });

                }
                this.tempIngredients = ''
            }
        },

        deleteIngredient(ingredient) {
            this.ingredients = this.ingredients.filter((item) => {
                return ingredient != item
            })
        },

        getRecipes() {
            let searchInputText = this.ingredients.join(',')
            const url = "https://api.spoonacular.com/recipes/findByIngredients"
            let n = 1
            axios.get(url, {
                params: {
                    ingredients:  searchInputText,
                    apiKey: apiKey,
                    number:50
                }
            })
                .then(response => {
                    var liked = false
                    console.log(response.data);
                    let output = `<div class="row row-cols-sm-1 row-cols-md-2 row-cols-lg-3 g-4">`
                    if (response.data.length != 0) {
                        response.data.forEach(meal => {

                            output += `
                            <div class = "col">
                                <div class="card effect shadow p-3 mb-5 bg-body rounded" data-id="${meal.id}" style='transition:1s;'>
                                    <img src="${meal.image}" class="card-img-top" alt="...">
                                    <div class="card-body ">
                                        <h5 class="card-title">${meal.title}</h5>
                                        
                                        <a href="#" class="recipe-btn">Recipe</a>
                                        <a href="#" class="ingredients-btn">Ingredients</a>
                                        `
                                        
                                        var likedRecipes = localStorage.getItem('likedRecipes')
                                        console.log(likedRecipes)
                                        if (likedRecipes === null) {
                                            localStorage.setItem('likedRecipes', '[]')
                                        }
                                        likedRecipes = JSON.parse(localStorage.getItem('likedRecipes'))
                                        
                                        for (let i=0; i<likedRecipes.length; i++){
                                            if (meal.id == likedRecipes[i]['id']){
                                                liked = true
                                        }}
    
                                        if (liked == true){  
                                            output += `<button id="like-btn${n}" style="color: red" class="like-btn mx-auto" onclick="change({id:${meal.id},img:'${meal.image}',title:'${meal.title}'})"><i class="fa-brands fa-gratipay"></i></button>`
                                            liked = false
                                        }else{
                                            output += `<button id="like-btn${n}" class="like-btn mx-auto" onclick="change({id:${meal.id},img:'${meal.image}',title:'${meal.title}'})"><i class="fa-brands fa-gratipay"></i></button>`
                                        }
                                        
                            output+= `       
                                    </div> 
                                </div>
                            </div>
                        `
                            n += 1
                        });
                        output += `
                            </div>
                        `

                        
                    } else {
                        output = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                                    <strong>Holy guacamole!</strong> Remember to press enter key to add ingredients first before searching! And please enter only VALID ingredients!
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                  </div>`
                        this.tempIngredients = ''
                        this.ingredients = []
                        // mealList.classList.add('notFound')
                    }

                    mealList.innerHTML = output
                })
                .catch( error => {
                    console.log(error.message);
                });
                }
            }
})

const vm = app.mount('#app')


///////////////////////////////////////////////////////////////////////////////

mealList.addEventListener('click', getMealRecipe)
recipeCloseBtn.addEventListener('click', () =>{
    mealDetailsContent.parentElement.classList.remove('showRecipe')
})
ingredientsCloseBtn.addEventListener('click', () =>{
    mealIngredientsContent.parentElement.classList.remove('showIngredients')
})


function getMealRecipe(e) {
    e.preventDefault()
    // console.log(e)
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
                let title = response.data.title
                let servings = response.data.servings
                let prepTime = response.data.readyInMinutes
                let summary = response.data.summary
                let recipeInstructionsArray = response.data.analyzedInstructions

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
                let ingredientsArray = response.data.extendedIngredients
                mealIngredientsModel(ingredientsArray)
            })
            .catch( error => {
                console.log(error.message);
            });

    }

}

// Function to display ingredients
function mealIngredientsModel(ingredientsArray) {
    let output = `<h3 class="title" style="font-family: 'Poppins', sans-serif;">Ingredients</h3><div style='display:flex; justify-content:center;'><ul class="fa-ul">`
    for (ingredient of ingredientsArray) {
        output += `<li> <i class="fa-solid fa-cart-shopping"></i><span class="ingredient">${ingredient.original}</span></li></li>`
    }

    output += "</ul></div>"
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

    directionOutput = "<div style='width:50%;'>"
    for (let step of steps) {
        directions = step.step
        stepNumber = step.number
        directionOutput += `<p style='text-align: left;'><span style="font-weight: 500;">${stepNumber}</span>: ${directions}</p>`
    }
    directionOutput += `</div>`

    let output = `
                    <h2 class="recipe-title" style="font-family: 'Poppins', sans-serif;">${title}</h2>
                    <p class="recipe-time"><i class="fa-solid fa-clock"></i> <span id="time-required">${prepTime}</span></p>
                    <p class="recipe-servings"><i class="fa-solid fa-utensils"></i> <span id="servings">${servings}</span></p>

                    <h3 style="font-family: 'Poppins', sans-serif;">Instructions</h3>
                    <div class="recipe-instruct">
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
// Setting liked recipes to local storage
function change(recipeObj) {
    
    console.log(recipeObj)
    var likedButton = document.getElementById(event.target.parentElement.id)

    let recipeID = recipeObj['id']
    let likedRecipes = JSON.parse(localStorage.getItem('likedRecipes'))

    if (likedButton.style.color == "red") {
        likedButton.style.color = "grey"

        for (let i=0; i< likedRecipes.length; i++) {
            if(likedRecipes[i]['id']== recipeID){
                likedRecipes.splice(i,1)
                // alert('Unsaved!')
            }
            // console.log(likedRecipes)
        }
        
    } else {
        likedButton.style.color = "red"

        axios.get(`https://api.spoonacular.com/recipes/${recipeObj.id}/information?includeNutrition=false`, {
            params: {
                apiKey: apiKey
            }
        })
            .then(response => {
                recipeObj.url = response.data.sourceUrl
                likedRecipes.push(recipeObj)
                localStorage.setItem('likedRecipes', JSON.stringify(likedRecipes))
                // alert('Saved!')
                
            })
            .catch( error => {
                console.log(error.message);
            });
        
    }
    localStorage.setItem('likedRecipes', JSON.stringify(likedRecipes))
    console.log(likedRecipes)
}
