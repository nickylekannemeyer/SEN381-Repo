// Typed error so controllers can map an engineering failure to an HTTP status.
class AppError extends Error {
  constructor(code, message, httpStatus) {
    super(message || code);
    this.code = code;
    this.httpStatus = httpStatus || 400;
  }
}
module.exports = AppError;
