var displayRecipes = document.getElementById("display-recipe")
let output = `<div class="row row-cols-auto g-2">`


const savedRecipes = JSON.parse(localStorage.getItem('likedRecipes'))
let n = 1
for (let savedRecipe of savedRecipes) {
    output += `
    <div class = "col">
        <div class="card" style="width: 15rem;">
            <img src="${savedRecipe.img}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${savedRecipe.title}</h5>
                <a href="${savedRecipe.url}" target="_blank" class="recipe-btn">Show me!</a>
                
                <button id="like-btn${n}" style="color: red" class="like-btn"><i class="fa-brands fa-gratipay" onclick='unsave({id:${savedRecipe.id}})'></i></button>
            </div>
        </div>
    </div>
    `
    n += 1
}

output += `
    </div>
`

displayRecipes.innerHTML = output

function unsave(recipeObj) {
    var likedButton = document.getElementById(event.target.parentElement.id)
    console.log(likedButton.parentNode.parentNode)
    likedButton.style.color = 'grey'
    likedButton.parentNode.parentNode.remove()

    let recipeID = recipeObj['id']
    for (let i=0; i< savedRecipes.length; i++) {
        if(savedRecipes[i]['id']== recipeID){
            savedRecipes.splice(i,1)
            alert('Unsaved!')
        }
        // console.log(likedRecipes)
    }

    localStorage.setItem('likedRecipes', JSON.stringify(savedRecipes))
}