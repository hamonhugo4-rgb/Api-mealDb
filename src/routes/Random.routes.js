import { Router } from "express"
import {
    chercherRepas,
    chercherUnRepas,
    RepasAleatoire,
    UnRepasAleatoire
} from '../services/themealdb.service.js'

const router = Router()

router.get('/',async (req,res)=>{
    const repas = await RepasAleatoire()
    if (!repas) {
        return res.status(502).json({ message: "Erreur avec l'API externe" });
    }
    if (repas.error) {
        return res.status(404).json({ message: repas.error });
    }
    res.json(repas)
})

router.get('/:categorie', async (req, res) => {
    const repas = await UnRepasAleatoire(req.params.categorie);
    
    if (!repas) {
        return res.status(502).json({ message: "Erreur avec l'API externe" });
    }
    if (repas.error) {
        return res.status(404).json({ message: repas.error });
    }
    
    res.json(repas);
});
export default router