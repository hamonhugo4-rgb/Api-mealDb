import { Router } from "express"
import { chercherRepas } from '../services/themealdb.service.js'

const router = Router()

router.get('/', async (req, res) => {
    const repas = await chercherRepas()

    if (!repas) {
        return res.status(500).json({ erreur: "Impossible de récupérer les repas" })
    }

    const total = repas.length
    const parCategorie = {}
    const parPays = {}
    const parIngredient = {}
    let sommeIngredients = 0

    for (const plat of repas) {
        
        if (parCategorie[plat.categorie]) {
            parCategorie[plat.categorie]++
        } else {
            parCategorie[plat.categorie] = 1
        }

        
        if (parPays[plat.pays]) {
            parPays[plat.pays]++
        } else {
            parPays[plat.pays] = 1
        }

        
        for (const ing of plat.ingredients) {
            const nomIng = ing.nom.toLowerCase()
            if (parIngredient[nomIng]) {
                parIngredient[nomIng]++
            } else {
                parIngredient[nomIng] = 1
            }
        }

        sommeIngredients += plat.nbIngredients
    }

    const moyenneNbIngredients = total > 0
        ? Number((sommeIngredients / total).toFixed(1))
        : 0

    let paysAvecLePlus = null
    let maxPays = 0
    for (const [pays, nb] of Object.entries(parPays)) {
        if (nb > maxPays) {
            maxPays = nb
            paysAvecLePlus = pays
        }
    }

    let categorieLaPlusPresente = null
    let maxCategorie = 0
    for (const [categorie, nb] of Object.entries(parCategorie)) {
        if (nb > maxCategorie) {
            maxCategorie = nb
            categorieLaPlusPresente = categorie
        }
    }

    let ingredientLePlusUtilise = null
    let maxIngredient = 0
    for (const [ing, nb] of Object.entries(parIngredient)) {
        if (nb > maxIngredient) {
            maxIngredient = nb
            ingredientLePlusUtilise = ing
        }
    }

    res.json({
        totalDansApi: total,
        parCategorie: parCategorie,
        nbPlatParPays: parPays,
        moyenneNbIngredients: moyenneNbIngredients,
        paysAvecLePlus: paysAvecLePlus,
        categorieLaPlusPresente: categorieLaPlusPresente,
        ingredientLePlusUtilise: ingredientLePlusUtilise
    })
})

router.get('/:pays', async (req, res) => {
    const repas = await chercherRepas()

    if (!repas) {
        return res.status(500).json({ erreur: "Impossible de récupérer les repas" })
    }

    const paysRecherche = req.params.pays.toLowerCase()
    const platsDuPays = repas.filter((plat) => plat.pays?.toLowerCase() === paysRecherche)

    if (platsDuPays.length === 0) {
        return res.status(404).json({ erreur: `Aucun plat trouvé pour le pays : ${req.params.pays}` })
    }

    const totalPays = platsDuPays.length
    const parCategorie = {}
    const parIngredient = {}
    let sommeIngredients = 0

    for (const plat of platsDuPays) {
        if (parCategorie[plat.categorie]) {
            parCategorie[plat.categorie]++
        } else {
            parCategorie[plat.categorie] = 1
        }

        for (const ing of plat.ingredients) {
            const nomIng = ing.nom.toLowerCase()
            if (parIngredient[nomIng]) {
                parIngredient[nomIng]++
            } else {
                parIngredient[nomIng] = 1
            }
        }

        sommeIngredients += plat.nbIngredients
    }

    let ingredientLePlusUtilise = null
    let maxIngredient = 0

    for (const [nom, nb] of Object.entries(parIngredient)) {
        if (nb > maxIngredient) {
            maxIngredient = nb
            ingredientLePlusUtilise = nom
        }
    }

    res.json({
        pays: platsDuPays[0].pays,
        nbPlats: totalPays,
        moyenneNbIngredients: Number((sommeIngredients / totalPays).toFixed(1)),
        repartitionCategories: parCategorie,
        ingredientLePlusUtilise: ingredientLePlusUtilise
    })
})

export default router