const Base = "https://www.themealdb.com/api/json/v1/1"

let cache = null
const alphabet = "abcdefghijklmnopqrstuvwxyz"

function nettoyer(plat) {
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
        const ingredient = plat[`strIngredient${i}`]
        const mesure = plat[`strMeasure${i}`]
        if (ingredient && ingredient.trim() !== "") {
            ingredients.push({
                nom: ingredient.trim(),
                quantite: mesure ? mesure.trim() : ""
            })
        }
    }

    return {
        id: plat.idMeal,
        nom: plat.strMeal,
        categorie: plat.strCategory,
        pays: plat.strArea,
        image: plat.strMealThumb,
        ingredients: ingredients,
        nbIngredients: ingredients.length
    }
}

export async function chercherRepas() {
    if (cache) {
        return cache
    }

    const tous = []

    for (let i = 0; i < alphabet.length; i++) {
        const url = Base + `/search.php?f=${alphabet[i]}`
        const response = await fetch(url)

        if (!response.ok) {
            return null
        }

        const donnees = await response.json()

        if (donnees.meals) {
            for (const plat of donnees.meals) {
                tous.push(nettoyer(plat))
            }
        }
    }

    cache = tous
    return tous
}

export async function chercherUnRepas(nom) {
    const response = await fetch(Base + '/search.php?s=' + nom)

    if (!response.ok) {
        return null
    }

    const donnees = await response.json()

    if (!donnees.meals) {
        return null
    }

    return nettoyer(donnees.meals[0])
}

export async function RepasAleatoire() {
    let entree = null;
    let plat_principale = null;
    let accompagnement = null;
    let dessert = null;

    
    while (!entree || !plat_principale || !accompagnement || !dessert) {
        const response = await fetch(Base + '/random.php');
        if (!response.ok) {
            return null;
        }

        const donnees = await response.json();
        const meal = donnees.meals?.[0]; 
        if (!meal) continue;

        if (meal.strCategory === "Starter") {
            if (!entree) entree = nettoyer(meal);
        } 
        else if (meal.strCategory === "Side") {
            if (!accompagnement) accompagnement = nettoyer(meal);
        } 
        else if (meal.strCategory === "Dessert" || meal.strMeal === "Vegan Chocolate Cake") {
            if (!dessert) dessert = nettoyer(meal);
        } 
        else {
            if (!plat_principale) plat_principale = nettoyer(meal);
        }
    }

    return {
        entree,
        plat_principale,
        accompagnement,
        dessert
    };
}