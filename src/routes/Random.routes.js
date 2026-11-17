import { Router } from "express"
import {
    chercherRepas,
    chercherUnRepas,
    RepasAleatoire
} from '../services/themealdb.service.js'

const router = Router()

router.get('/',async (req,res)=>{
    const repas = await RepasAleatoire()
    res.json(repas)
})
export default router