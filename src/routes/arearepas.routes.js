import { Router } from "express"
import { chercherRepas } from '../services/themealdb.service.js'

const router = Router()


router.get('/:pays', async (req, res) => {
    let repas = await chercherRepas()

    if (!repas) {
        return res.status(502).json({ message: "Erreur avec l'API externe" })
    }

    const recherche = req.params.pays.toLowerCase()
    const resultat = repas.filter((plat) => plat.pays && plat.pays.toLowerCase() === recherche)

    if (resultat.length === 0) {
        return res.status(404).json({ message: `Aucun plat trouvé pour : ${req.params.pays} essayer de mettre la nationalité plutot que le pays` })
    }

    res.json(resultat)
})

export default router