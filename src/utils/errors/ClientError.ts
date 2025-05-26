import BaseError from './BaseError.js';
import { CLIENT_CODE } from './errorConstants.js';

export class ClientError extends BaseError {
    constructor(name: string, cause: string, httpCode: number) {
        super(name, cause, httpCode);

        if (typeof name !== 'string') {
            this.name = 'client error';
        }

        if (typeof cause !== 'string') {
            this.cause = 'client error with no cause defined !';
        }

        if (!(Object.values(CLIENT_CODE) as number[]).includes(httpCode)) {
            this.httpCode = 400;
        }
    }
}

// ============ PAYMENT & SUBSCRIPTION ERRORS ============

export class PaymentRequiredError extends ClientError {
    constructor(cause: string = 'Payment required to access this resource.') {
        super('PAYMENT REQUIRED', cause, CLIENT_CODE.PAYMENT_REQUIRED);
    }
}

// ============ AUTHENTICATION & AUTHORIZATION ERRORS ============

export class UnauthorizedError extends ClientError {
    constructor(cause: string = 'Authentication required. Please provide valid credentials.') {
        super('UNAUTHORIZED', cause, CLIENT_CODE.UNAUTHORIZED);
    }
}

export class ForbiddenError extends ClientError {
    constructor(cause: string = 'Access denied. You do not have permission to access this resource.') {
        super('FORBIDDEN', cause, CLIENT_CODE.FORBIDDEN);
    }
}

// ============ REQUEST FORMAT & VALIDATION ERRORS ============

export class BadRequestError extends ClientError {
    constructor(cause: string = 'Invalid request format or parameters.') {
        super('BAD REQUEST', cause, CLIENT_CODE.BAD_REQUEST);
    }
}

export class UnprocessableContentError extends ClientError {
    constructor(cause: string = 'Request contains semantic errors that prevent processing.') {
        super('UNPROCESSABLE CONTENT', cause, CLIENT_CODE.UNPROCESSABLE);
    }
}

export class NotAcceptableError extends ClientError {
    constructor(cause: string = 'Server cannot produce content in the format requested by client.') {
        super('NOT ACCEPTABLE', cause, CLIENT_CODE.UNACCEPTABLE);
    }
}

export class GoneError extends ClientError {
    constructor(cause: string = 'The requested resource is no longer available and will not be available again.') {
        super('GONE', cause, CLIENT_CODE.GONE);
    }
}

export class LengthRequiredError extends ClientError {
    constructor(cause: string = 'Content-Length header is required for this request.') {
        super('LENGTH REQUIRED', cause, CLIENT_CODE.LENGTH_REQUIRED);
    }
}

export class PayloadTooLargeError extends ClientError {
    constructor(cause: string = 'Request payload is too large for the server to process.') {
        super('PAYLOAD TOO LARGE', cause, CLIENT_CODE.LARGE_PAYLOAD);
    }
}

export class UriTooLongError extends ClientError {
    constructor(cause: string = 'Request URI is too long for the server to process.') {
        super('URI TOO LONG', cause, CLIENT_CODE.LONG_URI);
    }
}

export class UnsupportedMediaTypeError extends ClientError {
    constructor(cause: string = 'Request content type is not supported by the server.') {
        super('UNSUPPORTED MEDIA TYPE', cause, CLIENT_CODE.UNSUPPORTED_MEDIA);
    }
}

export class RangeNotSatisfiableError extends ClientError {
    constructor(cause: string = 'Range specified in request cannot be satisfied.') {
        super('RANGE NOT SATISFIABLE', cause, CLIENT_CODE.RANGE_UNSATISFIED);
    }
}

export class ExpectationFailedError extends ClientError {
    constructor(cause: string = 'Server cannot meet the requirements of the Expect request header.') {
        super('EXPECTATION FAILED', cause, CLIENT_CODE.EXPECTATION_FAILED);
    }
}

export class LockedError extends ClientError {
    constructor(cause: string = 'The requested resource is currently locked.') {
        super('LOCKED', cause, CLIENT_CODE.LOCKED);
    }
}

export class UpgradeRequiredError extends ClientError {
    constructor(cause: string = 'Client must upgrade to a different protocol to access this resource.') {
        super('UPGRADE REQUIRED', cause, CLIENT_CODE.UPGRADE_REQUIRED);
    }
}

export class TooManyRequestsError extends ClientError {
    constructor(cause: string = 'Too many requests sent in a given amount of time. Please slow down.') {
        super('TOO MANY REQUESTS', cause, CLIENT_CODE.MANY_REQUESTS);
    }
}

export class RequestHeaderTooLargeError extends ClientError {
    constructor(cause: string = 'Request header fields are too large.') {
        super('REQUEST HEADER FIELDS TOO LARGE', cause, CLIENT_CODE.LARGE_HEADER);
    }
}

// ============ RESOURCE & ROUTING ERRORS ============

export class NotFoundError extends ClientError {
    constructor(cause: string = 'The requested resource could not be found.') {
        super('NOT FOUND', cause, CLIENT_CODE.UNFOUND);
    }
}

export class MethodNotAllowedError extends ClientError {
    constructor(cause: string = 'HTTP method not allowed for this endpoint.') {
        super('METHOD NOT ALLOWED', cause, CLIENT_CODE.METHOD_UNALLOWED);
    }
}

// ============ TIMING & STATE ERRORS ============

export class TimeoutError extends ClientError {
    constructor(cause: string = 'Request timeout. The client took too long to send the request.') {
        super('REQUEST TIMEOUT', cause, CLIENT_CODE.TIMEOUT);
    }
}

export class ConflictError extends ClientError {
    constructor(cause: string = 'Request conflicts with the current state of the resource.') {
        super('CONFLICT', cause, CLIENT_CODE.CONFLICT);
    }
}

// ============ PRECONDITION ERRORS ============

export class FailedPreconditionError extends ClientError {
    constructor(cause: string = 'Precondition specified in request headers failed.') {
        super('PRECONDITION FAILED', cause, CLIENT_CODE.FAILED_PRECONDITION);
    }
}

export class PreconditionRequiredError extends ClientError {
    constructor(cause: string = 'Request must include precondition headers (If-Match, If-None-Match, etc.).') {
        super('PRECONDITION REQUIRED', cause, CLIENT_CODE.REQUIRED_PRECONDITION);
    }
}

// ============ FUN ERROR ============

export class TeaPotError extends ClientError {
    constructor(cause: string = "I'm a teapot. Cannot brew coffee with a teapot.") {
        super("I'M A TEAPOT", cause, CLIENT_CODE.TEA_POT);
    }
}
