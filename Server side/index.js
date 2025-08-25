import express from 'express'
import cors from 'cors'
const app = express()
import {connection} from './database/connection/connection.js'
import artistRoutes from './src/modules/artist/artist.routes.js'
import arwtorkRoutes from './src/modules/artwork/artwork.routes.js'


connection()

app.use(express.json());
app.use(cors());
app.use('/api/v1/artist',artistRoutes)
app.use('/api/v1/artwork',arwtorkRoutes)


app.get('/', (req, res) =>{ 
    res.send("Start")
})

app.listen(3000)