import { Router } from "express";
import {
    chercherPersonnages,
    chercherUnPersonnage
}from '../services/rick-and-morty.service.js'

const router = Router()

router.get('/', async (req,res)=>{
        let personnage = await chercherPersonnages()
        if(req.query.espece){
         personnage = personnage.filter((perso)=>perso.espece=== req.query.espece)
        }
        if (req.query.statut){
            personnage = personnage.filter((perso)=>perso.statut=== req.query.statut)
        }
        if (req.query.nom) {
        personnage = personnage.filter((perso) =>
            perso.nom.toLowerCase().includes(req.query.nom.toLowerCase())
        )}
        res.json(personnage)
})

router.get('/:id',async (req,res)=>{
        let perso =await chercherUnPersonnage(req.params.id)

        if (perso === null){
            return res.status(404).json({erreur :"Personnage introuvable"})
        }
        res.json(perso)
})

export default router