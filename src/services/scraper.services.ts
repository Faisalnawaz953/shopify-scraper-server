import { createObjectCsvWriter } from 'csv-writer'
import fetch from 'node-fetch'
import messages from '../utilities/messages'
import csvToJson from 'csvtojson'
class ScraperServices {
  //import axios from "axios"
  async pagination(url: string) {
    let records = []
    let pageNumber = 1
    try {
      while (pageNumber > 0) {
        const currentRecords = await fetch(
          `https://${url}/products.json?page=${pageNumber}&limit=250`
        )
        if (currentRecords.status !== 200) {
          return []
        }
        const response = await currentRecords.json()
        if (response.products.length !== 0) {
          records = [...records, ...response.products]
          pageNumber++
        } else {
          console.log('terminated')
          break
        }
      }
      return records
    } catch (error) {
      console.log(error)
    }
  }
  getProductsByDateArray(products: any[]) {
    let result: number = 0
    let index: number = 0
    let arrayLength: number = products.length
    const product_by_date = []
    while (arrayLength != 0) {
      result = products.filter(function (product) {
        return (
          new Date(product.created_at).toLocaleDateString() ==
          new Date(products[index].created_at).toLocaleDateString()
        )
      }).length
      product_by_date.push({
        date: `${new Date(products[index].created_at).toLocaleDateString()}`,
        count: result,
      })
      index = index + result
      arrayLength = arrayLength - result
      if (index > products.length) {
        break
      }
    }
    return product_by_date
  }
  async createProductByDateCsvFile(product_by_date: any[], name: string) {
    const csvWriterForDate = createObjectCsvWriter({
      path: `${name}_product_by_date.csv`,
      header: [
        { id: 'date', title: 'DATE' },
        { id: 'count', title: 'COUNT' },
      ],
    })
    await csvWriterForDate
      .writeRecords(product_by_date)
      .then(() => {
        console.log(messages.PRODUCT_BY_DATE_CSV_CREATED)
      })
      .catch((err) => {
        console.log(messages.PRODUCT_BY_DATE_CSV_NOT_CREATED)
        throw new Error(err)
      })
  }
  sortByDate(products: any[]) {
    const result = products.sort(function (a, b) {
      var keyA = new Date(a.created_at),
        keyB = new Date(b.created_at)
      // Compare the 2 dates
      if (keyA < keyB) return -1
      if (keyA > keyB) return 1
      return 0
    })
    return result
  }

  getProductsByTypeArray(products: any[]) {
    let result: number = 0
    let index: number = 0
    let arrayLength: number = products.length
    const product_by_type = []
    while (arrayLength != 0) {
      if (products[index].product_type == '') {
        index = index + 1
        arrayLength = arrayLength - 1
        continue
      }
      result = products.filter(function (product) {
        return product.product_type == products[index].product_type
      }).length
      product_by_type.push({
        type: `${products[index].product_type}`,
        count: result,
      })
      index = index + result
      arrayLength = arrayLength - result
      if (index > products.length) {
        break
      }
    }
    return product_by_type
  }

  async createProductByTypeCsvFile(product_by_type: any[], name: string) {
    const csvWriterForType = createObjectCsvWriter({
      path: `${name}_product_by_type.csv`,
      header: [
        { id: 'type', title: 'TYPE' },
        { id: 'count', title: 'COUNT' },
      ],
    })
    await csvWriterForType
      .writeRecords(product_by_type)
      .then(() => {
        console.log(messages.PRODUCT_BY_TYPE_CSV_CREATED)
      })
      .catch((err) => {
        console.log(messages.PRODUCT_BY_TYPE_CSV_NOT_CREATED)
        throw new Error(err)
      })
  }
  sortByType(products: any[]) {
    return products.sort(function (a, b) {
      var keyA = a.product_type,
        keyB = b.product_type
      // Compare the 2 types
      if (keyA < keyB) return -1
      if (keyA > keyB) return 1
      return 0
    })
  }

  async csvFileToJson(csvFile: string) {
    return await csvToJson().fromFile(csvFile)
  }
}

export default new ScraperServices()
