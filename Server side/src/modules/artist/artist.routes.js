import express from 'express'
const router = express.Router()
import * as artistController from './controller/artist.controller.js'

router.get('/allArtists',artistController.getAllArtist)
router.get('/allArtistsArtworks',artistController.getAllArtistWithArtworks)
router.get('/oneArtist/:id',artistController.getArtistById)
router.post('/',artistController.addArtist)
router.delete('/:id',artistController.deleteArtist)

export default router