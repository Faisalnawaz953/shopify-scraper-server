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
const messages_1 = __importDefault(require("../utilities/messages"));
const constants_1 = __importDefault(require("../utilities/constants"));
const scraper_services_1 = __importDefault(require("../services/scraper.services"));
const responseService_1 = __importDefault(require("../services/responseService"));
const fs_1 = __importDefault(require("fs"));
class ScrapperController {
    getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let path = `ShopifyStoreList`;
            let data = fs_1.default.readFileSync(path, { encoding: `utf8` });
            let lines = data.split(`\n`);
            console.log('LINES', lines);
            for (let i = 0; i < lines.length; i++) {
                //inner loop
                let shopifyURL = JSON.stringify(lines[i]);
                let newURL = shopifyURL.split('\\');
                let url = newURL[0].replace('"', '');
                if (url.length === 0) {
                    continue;
                }
                const products = yield scraper_services_1.default.pagination(url);
                if (products.length === 0) {
                    continue;
                }
                const sortedByDateProducts = scraper_services_1.default.sortByDate(products);
                const product_by_date = scraper_services_1.default.getProductsByDateArray(sortedByDateProducts);
                scraper_services_1.default.createProductByDateCsvFile(product_by_date, url);
                const sortedByTypeProducts = scraper_services_1.default.sortByType(products);
                const product_by_type = scraper_services_1.default.getProductsByTypeArray(sortedByTypeProducts);
                scraper_services_1.default.createProductByTypeCsvFile(product_by_type, url);
            }
            res
                .status(constants_1.default.CODE.OK)
                .send((0, responseService_1.default)(constants_1.default.STATUS.SUCCESS, {}, messages_1.default.CSV_Files_Created));
        });
    }
    getAllStores(req, res) {
        let path = `ShopifyStoreList`;
        let data = fs_1.default.readFileSync(path, { encoding: `utf8` });
        let lines = data.split(`\n`);
        console.log('LINES', lines);
        let stores = [];
        for (let i = 0; i < lines.length; i++) {
            //inner loop
            let shopifyURL = JSON.stringify(lines[i]);
            let newURL = shopifyURL.split('\\');
            let url = newURL[0].replace('"', '');
            stores.push(url);
        }
        stores[lines.length - 1] = stores[lines.length - 1].replace('"', '');
        res
            .status(constants_1.default.CODE.OK)
            .send((0, responseService_1.default)(constants_1.default.STATUS.SUCCESS, stores, messages_1.default.Returned_ALL_Stores));
    }
    getJsonFiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let storeName = req.body.store;
            const jsonByDate = yield scraper_services_1.default.csvFileToJson(`${storeName}_product_by_date.csv`);
            const jsonByType = yield scraper_services_1.default.csvFileToJson(`${storeName}_product_by_type.csv`);
            if (jsonByDate && jsonByType) {
                res
                    .status(constants_1.default.CODE.OK)
                    .send((0, responseService_1.default)(constants_1.default.STATUS.SUCCESS, { product_by_date: jsonByDate, product_by_type: jsonByType }, messages_1.default.CsvToJson_Object_Returned));
            }
        });
    }
}
// module.exports = pagination;
exports.default = new ScrapperController();
//# sourceMappingURL=scraper.controller.js.map