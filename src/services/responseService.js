class ResponseService {
  static status;
  static responseService(state, responseData, message) {
    let responseObj;
    responseObj = {
      metadata: {
        status: state,
        message: message,
        responseCode: this.status,
      },
      payload: {
        data: responseData,
      },
    };
    return responseObj;
  }
}
module.exports = ResponseService;
