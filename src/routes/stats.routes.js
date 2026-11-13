import { Router } from 'express'
import {
    chercherPersonnages,
    chercherUnPersonnage
} from '../services/rick-and-morty.service.js'

const router = Router()

router.get('/',async (req,res)=>{
    const { total, personnages } = await chercherPagePersonnages()
    const parStatut ={}
    const parEspece={}

    for (const perso of personnages){
        parStatut[perso.statut] = (parStatut[perso.statut] || 0) + 1
        parEspece[perso.espece] = (parEspece[perso.espece] || 0) + 1
    }

    let especeLaPlusFrequente = "";
    let maxEspece = 0;
    for (const [espece, nombre] of Object.entries(parEspece)) {
        if (nombre > maxEspece) {
            maxEspece = nombre;
            especeLaPlusFrequente = espece;
        }
    }

    const nbPersonnageVivants = parStatut["Alive"] || 0
    res.json({
        totalDansApi: total,
        surCettePage: personnages.length,
        parStatut: parStatut,
        parEspece: parEspece,
        nbPersonnageVivants: nbPersonnageVivants,
        especeLaPlusFrequente: especeLaPlusFrequente
    })
})

export default router
