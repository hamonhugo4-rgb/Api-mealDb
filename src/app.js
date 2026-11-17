import express from 'express';
import repasRoute from './routes/repas.routes.js';
import stats from './routes/stats.routes.js';
import alea from './routes/Random.routes.js';
import country from './routes/arearepas.routes.js';
import cors from 'cors'
const app = express()
app.use(cors())
app.get('/health',(req,res)=>{
    return res.json({
        version: "1.0.0"
    })
})

app.use('/api/repas', repasRoute)
app.use('/api/stats', stats)
app.use('/api/random',alea)
app.use('/api/area',country)

app.use((req,res)=>{
    res.status(404).json({erreur:"Route introuvable"})
})
app.use((err,req,res,next)=>{
    console.log(err)
    res.status(500).json({erreur:"erreur serveur"})
})

export default app