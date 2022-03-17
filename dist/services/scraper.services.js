"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csv_writer_1 = require("csv-writer");
const node_fetch_1 = __importDefault(require("node-fetch"));
const messages_1 = __importDefault(require("../utilities/messages"));
const csvtojson_1 = __importDefault(require("csvtojson"));
class ScraperServices {
    //import axios from "axios"
    pagination(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let records = [];
            let pageNumber = 1;
            try {
                while (pageNumber > 0) {
                    const currentRecords = yield (0, node_fetch_1.default)(`https://${url}/products.json?page=${pageNumber}&limit=250`);
                    if (currentRecords.status !== 200) {
                        return [];
                    }
                    const response = yield currentRecords.json();
                    if (response.products.length !== 0) {
                        records = [...records, ...response.products];
                        pageNumber++;
                    }
                    else {
                        console.log('terminated');
                        break;
                    }
                }
                return records;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getProductsByDateArray(products) {
        let result = 0;
        let index = 0;
        let arrayLength = products.length;
        const product_by_date = [];
        while (arrayLength != 0) {
            result = products.filter(function (product) {
                return (new Date(product.created_at).toLocaleDateString() ==
                    new Date(products[index].created_at).toLocaleDateString());
            }).length;
            product_by_date.push({
                date: `${new Date(products[index].created_at).toLocaleDateString()}`,
                count: result,
            });
            index = index + result;
            arrayLength = arrayLength - result;
            if (index > products.length) {
                break;
            }
        }
        return product_by_date;
    }
    createProductByDateCsvFile(product_by_date, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const csvWriterForDate = (0, csv_writer_1.createObjectCsvWriter)({
                path: `${name}_product_by_date.csv`,
                header: [
                    { id: 'date', title: 'DATE' },
                    { id: 'count', title: 'COUNT' },
                ],
            });
            yield csvWriterForDate
                .writeRecords(product_by_date)
                .then(() => {
                console.log(messages_1.default.PRODUCT_BY_DATE_CSV_CREATED);
            })
                .catch((err) => {
                console.log(messages_1.default.PRODUCT_BY_DATE_CSV_NOT_CREATED);
                throw new Error(err);
            });
        });
    }
    sortByDate(products) {
        const result = products.sort(function (a, b) {
            var keyA = new Date(a.created_at), keyB = new Date(b.created_at);
            // Compare the 2 dates
            if (keyA < keyB)
                return -1;
            if (keyA > keyB)
                return 1;
            return 0;
        });
        return result;
    }
    getProductsByTypeArray(products) {
        let result = 0;
        let index = 0;
        let arrayLength = products.length;
        const product_by_type = [];
        while (arrayLength != 0) {
            if (products[index].product_type == '') {
                index = index + 1;
                arrayLength = arrayLength - 1;
                continue;
            }
            result = products.filter(function (product) {
                return product.product_type == products[index].product_type;
            }).length;
            product_by_type.push({
                type: `${products[index].product_type}`,
                count: result,
            });
            index = index + result;
            arrayLength = arrayLength - result;
            if (index > products.length) {
                break;
            }
        }
        return product_by_type;
    }
    createProductByTypeCsvFile(product_by_type, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const csvWriterForType = (0, csv_writer_1.createObjectCsvWriter)({
                path: `${name}_product_by_type.csv`,
                header: [
                    { id: 'type', title: 'TYPE' },
                    { id: 'count', title: 'COUNT' },
                ],
            });
            yield csvWriterForType
                .writeRecords(product_by_type)
                .then(() => {
                console.log(messages_1.default.PRODUCT_BY_TYPE_CSV_CREATED);
            })
                .catch((err) => {
                console.log(messages_1.default.PRODUCT_BY_TYPE_CSV_NOT_CREATED);
                throw new Error(err);
            });
        });
    }
    sortByType(products) {
        return products.sort(function (a, b) {
            var keyA = a.product_type, keyB = b.product_type;
            // Compare the 2 types
            if (keyA < keyB)
                return -1;
            if (keyA > keyB)
                return 1;
            return 0;
        });
    }
    csvFileToJson(csvFile) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, csvtojson_1.default)().fromFile(csvFile);
        });
    }
}
exports.default = new ScraperServices();
//# sourceMappingURL=scraper.services.js.map