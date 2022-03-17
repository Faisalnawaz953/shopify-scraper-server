import messages from '../utilities/messages'
import constants from '../utilities/constants'
import scraperServices from '../services/scraper.services'
import { Request, Response } from 'express'
import responseService from '../services/responseService'
import fs from 'fs'
class ScrapperController {
  async getAllProducts(req: Request, res: Response) {
    let path = `ShopifyStoreList`
    let data = fs.readFileSync(path, { encoding: `utf8` })
    let lines = data.split(`\n`)
    console.log('LINES', lines)
    for (let i = 0; i < lines.length; i++) {
      //inner loop
      let shopifyURL = JSON.stringify(lines[i])
      let newURL = shopifyURL.split('\\')
      let url = newURL[0].replace('"', '')
      if (i === lines.length - 1) {
        url = url.replace('"', '')
      }
      if (url.length === 0) {
        continue
      }
      const products = await scraperServices.pagination(url)
      if (products.length === 0) {
        continue
      }
      const sortedByDateProducts = scraperServices.sortByDate(products)
      const product_by_date = scraperServices.getProductsByDateArray(sortedByDateProducts)
      scraperServices.createProductByDateCsvFile(product_by_date, url)

      const sortedByTypeProducts = scraperServices.sortByType(products)
      const product_by_type = scraperServices.getProductsByTypeArray(sortedByTypeProducts)
      scraperServices.createProductByTypeCsvFile(product_by_type, url)
    }
    res
      .status(constants.CODE.OK)
      .send(responseService(constants.STATUS.SUCCESS, {}, messages.CSV_Files_Created))
  }

  getAllStores(req: Request, res: Response) {
    let path = `ShopifyStoreList`
    let data = fs.readFileSync(path, { encoding: `utf8` })
    let lines = data.split(`\n`)
    console.log('LINES', lines)
    let stores = []
    for (let i = 0; i < lines.length; i++) {
      //inner loop
      let shopifyURL = JSON.stringify(lines[i])
      let newURL = shopifyURL.split('\\')
      let url = newURL[0].replace('"', '')
      stores.push(url)
    }
    stores[lines.length - 1] = stores[lines.length - 1].replace('"', '')
    res
      .status(constants.CODE.OK)
      .send(responseService(constants.STATUS.SUCCESS, stores, messages.Returned_ALL_Stores))
  }
  async getJsonFiles(req: Request, res: Response) {
    let storeName = req.body.store as string
    const jsonByDate = await scraperServices.csvFileToJson(`${storeName}_product_by_date.csv`)
    const jsonByType = await scraperServices.csvFileToJson(`${storeName}_product_by_type.csv`)
    if (jsonByDate && jsonByType) {
      res
        .status(constants.CODE.OK)
        .send(
          responseService(
            constants.STATUS.SUCCESS,
            { product_by_date: jsonByDate, product_by_type: jsonByType },
            messages.CsvToJson_Object_Returned
          )
        )
    }
  }
}

// module.exports = pagination;
export default new ScrapperController()
