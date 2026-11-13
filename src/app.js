import express from 'express';

import cors from 'cors'
const app = express()
app.use(cors())
app.get('/health',(req,res)=>{
    return res.json({
        version: "1.0.0"
    })
})



app.use((req,res)=>{
    res.status(404).json({erreur:"Route introuvable"})
})
app.use((err,req,res,next)=>{
    console.log(err)
    res.status(500).json({erreur:"erreur serveur"})
})

export default app