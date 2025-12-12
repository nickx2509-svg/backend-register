class ApiResponse {
  constructor(
    statusCode,
    data,
    message = "Success"
  ){
    this.statusCode = statusCode//// HTTP status code (200, 201, etc..
    this.data = data // autual data which want to send
    this.message = message // success message 
    this.success = statusCode < 400 //success true for 399 otherwise false
  }
}