import constants from '../utilities/constants'
export default function responseService(status: string, responseData: Object, message: string) {
  let responseObj: Object
  if (status === constants.STATUS.SUCCESS) {
    responseObj = {
      metadata: {
        status: status,
        message: message,
        responseCode: constants.CODE.OK,
      },
      payload: {
        data: responseData,
      },
    }
  } else if (status === constants.STATUS.ERROR) {
    responseObj = {
      metadata: {
        status: status,
        message: message,
        responseCode: constants.CODE.OK,
      },
      payload: {
        data: responseData,
      },
    }
  } else {
    responseObj = {
      metadata: {
        status: status,
        message: message,
        responseCode: constants.CODE.OK,
      },
      payload: {
        data: responseData,
      },
    }
  }
  return responseObj
}
