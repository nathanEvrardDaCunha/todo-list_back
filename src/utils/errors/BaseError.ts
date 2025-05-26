export default abstract class BaseError extends Error {
    name: string = '';
    cause: string = '';
    httpCode: number = 500;

    constructor(name: string, cause: string, httpCode: number) {
        super(cause);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;
        this.cause = cause;
        this.httpCode = httpCode;

        Error.captureStackTrace(this);
    }
}
