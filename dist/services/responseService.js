"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __importDefault(require("../utilities/constants"));
function responseService(status, responseData, message) {
    let responseObj;
    if (status === constants_1.default.STATUS.SUCCESS) {
        responseObj = {
            metadata: {
                status: status,
                message: message,
                responseCode: constants_1.default.CODE.OK,
            },
            payload: {
                data: responseData,
            },
        };
    }
    else if (status === constants_1.default.STATUS.ERROR) {
        responseObj = {
            metadata: {
                status: status,
                message: message,
                responseCode: constants_1.default.CODE.OK,
            },
            payload: {
                data: responseData,
            },
        };
    }
    else {
        responseObj = {
            metadata: {
                status: status,
                message: message,
                responseCode: constants_1.default.CODE.OK,
            },
            payload: {
                data: responseData,
            },
        };
    }
    return responseObj;
}
exports.default = responseService;
//# sourceMappingURL=responseService.js.map