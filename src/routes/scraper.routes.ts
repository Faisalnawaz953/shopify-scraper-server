import scraperController from '../controller/scraper.controller'
import { Router } from 'express'

const router = Router()

router.get('/get-all-products', scraperController.getAllProducts)
router.get('/get-all-stores', scraperController.getAllStores)
router.post('/get-store-data', scraperController.getStoreData)

export default router
