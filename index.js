const { loadIngredients, loadCategories, loadAreas, loadRecipes } = require('./utils');
const fs = require('fs');

//loadIngredients();
//loadCategories();
//loadAreas();
//loadRecipes();

const areGivenIngredientsPresent = (recipeIngredients, ingredients) => {
    let response = true;
    ingredients.forEach( ingredient => {
        if (!recipeIngredients.includes(ingredient)) {
            response = false;
        }
    })
    return response;
}

const searchForRecipes = (list) => {
    const recipes = JSON.parse(fs.readFileSync('recipes.json')).recipes;
    const ingredients = list.split(',');
    const result = [];

    recipes.forEach(recipe => {
        const isMatch = areGivenIngredientsPresent(recipe.ingredients.map(i => i.name), ingredients);
        if(isMatch) {
            result.push({...recipe, score: ingredients.length/recipe.ingredients.length})
        }
    });

    result.sort((a,b) => (a.score > b.score) ? -1 : ((b.score > a.score) ? 1 : 0));
    return result;
}

const recipes = searchForRecipes("Beef,Carrots,Onion") 
console.log(recipes.map(r => r.id));  // Returns [1, 19, 23]


