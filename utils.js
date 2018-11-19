const axios = require('axios');
const fs = require('fs');

const loadIngredients = async () => {
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    const ingredients = response.data.meals;

    const result = [];
    ingredients.forEach((item, index) => {
        result.push({
            id: index + 1,
            name: item.strIngredient,
            description: item.strDescription,
            type: item.strType,
            img: `https://www.themealdb.com/images/ingredients/${item.strIngredient}.png`,
            imgSmall: `https://www.themealdb.com/images/ingredients/${item.strIngredient}-Small.png`
        })
    });

    fs.writeFile('ingredients.json', JSON.stringify({ "ingredients": result}, null, 2));
}

const loadCategories = async () => {
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
    const categories = response.data.meals;

    const result = [];
    categories.forEach((item, index) => {
        result.push({
            id: index + 1,
            name: item.strCategory
        })
    });

    fs.writeFile('categories.json', JSON.stringify({ "categories": result}, null, 2));
}

const loadAreas = async () => {
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    const areas = response.data.meals;

    const result = [];
    areas.forEach((item, index) => {
        result.push({
            id: index + 1,
            name: item.strArea
        })
    });

    fs.writeFile('areas.json', JSON.stringify({ "areas": result}, null, 2));
}

const loadRecipeForId = async (mealId, id) => {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const recipe = response.data.meals[0];

    const ingredients = [];

    for(let i = 1; i <= 20; i++) {
        const name = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if(name && name.length) {
            ingredients.push({
                name,
                measure: (measure && measure.length) ? measure : null
            })
        }
    }

    const result = {
        id,
        name: recipe.strMeal,
        category: recipe.strCategory,
        area: recipe.strArea,
        instructions: recipe.strInstructions,
        image: recipe.strMealThumb,
        tags: recipe.strTags,
        video: recipe.strYoutube,
        source: recipe.strSource,
        ingredients
    };

    return result;

}

const loadRecipes = async () => {
    const categories = JSON.parse(fs.readFileSync('categories.json')).categories;
    const result = [];
    let index = 1;

    //const categories = [{"id": 12,"name": "Vegan"}]
    for (const item of categories) {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${item.name}`);
        const recipes = response.data.meals;

        for (const r of recipes) {
            if(r.idMeal) {
                const recipe = await loadRecipeForId(r.idMeal, index);
                //console.log(recipe);
                result.push(recipe);
                index++;
            }
        };
    };
    fs.writeFile('recipes.json', JSON.stringify({ "recipes": result}, null, 2), (error) => { console.log(error) });
}

module.exports = {
    loadIngredients,
    loadCategories,
    loadAreas,
    loadRecipes
}