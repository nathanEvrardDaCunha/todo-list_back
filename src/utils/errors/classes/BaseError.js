export default class AbstractBaseError extends Error {
    name = '';
    cause = '';
    httpCode = 500;

    constructor(name, cause, httpCode) {
        super(cause);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;
        this.cause = cause;
        this.httpCode = httpCode;

        Error.captureStackTrace(this);
    }
}
