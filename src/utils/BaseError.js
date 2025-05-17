import {
    HTTP_CLIENT_CODE,
    HTTP_SERVER_CODE,
} from '../constants/http-constants.js';

class AbstractBaseError extends Error {
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

class ClientError extends AbstractBaseError {
    constructor(name, cause, httpCode) {
        super(name, cause, httpCode);

        if (typeof name !== 'string') {
            this.name = 'client error';
        }

        if (typeof cause !== 'string') {
            this.name = 'client error with no cause defined !';
        }

        if (!Object.values(HTTP_CLIENT_CODE).includes(httpCode)) {
            this.httpCode = 400;
        }
    }
}

class ServerError extends AbstractBaseError {
    constructor(name, cause, httpCode) {
        super(name, cause, httpCode);

        if (typeof name !== 'string') {
            this.name = 'server error';
        }

        if (typeof cause !== 'string') {
            this.name = 'server error with no cause defined !';
        }

        if (!Object.values(HTTP_SERVER_CODE).includes(httpCode)) {
            this.httpCode = 500;
        }
    }
}

export { ClientError, ServerError };
