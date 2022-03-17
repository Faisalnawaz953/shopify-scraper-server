"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scraper_controller_1 = __importDefault(require("../controller/scraper.controller"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/getAllProducts', scraper_controller_1.default.getAllProducts);
router.get('/getAllStores', scraper_controller_1.default.getAllStores);
router.post('/getJsonFiles', scraper_controller_1.default.getJsonFiles);
exports.default = router;
//# sourceMappingURL=scraper.routes.js.map