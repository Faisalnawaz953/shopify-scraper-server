import scraperController from '../controller/scraper.controller'
import { Router } from 'express'

const router = Router()

router.get('/getAllProducts', scraperController.getAllProducts)
router.get('/getAllStores', scraperController.getAllStores)
router.post('/getJsonFiles', scraperController.getJsonFiles)

export default router
