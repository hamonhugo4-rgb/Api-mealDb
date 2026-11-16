import { Router } from "express"
import {
    chercherRepas,
    chercherUnRepas
} from '../services/themealdb.service.js'

const router = Router()

router.get('/', async (req, res) => {
    const repas = await chercherRepas()
    res.json(repas)
})

router.get('/:name', async (req, res) => {
    const repas = await chercherUnRepas(req.params.name)

    if (!repas) {
        return res.status(404).json({ erreur: "Plat introuvable" })
    }

    res.json(repas)
})

export default router