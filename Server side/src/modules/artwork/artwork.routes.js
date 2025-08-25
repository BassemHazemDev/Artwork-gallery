import express from 'express'
const router = express.Router()
import * as artworkController from './controller/artwork.controller.js'

router.get('/allArtworksAllArtists',artworkController.getAllArtworksAllArtists)
router.get('/sales',artworkController.salesReport)
router.get('/allArtworks/:sortBy',artworkController.getAllArtwork)
router.get('/artArtworksArtist/:id',artworkController.getArtworkByArtist)
router.get('/oneArtwork/:title',artworkController.getArtworkByTitle)
router.post('/',artworkController.addArtwork)
router.delete('/:id',artworkController.deleteArtwork)

export default router