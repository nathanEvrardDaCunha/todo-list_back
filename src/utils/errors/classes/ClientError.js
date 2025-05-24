import AbstractBaseError from './BaseError.js';
import HTTP_CLIENT_CODE from '../constants/clientStatusCode.js';

/**
 * Used when verifying specific error is an extension of ClientError
 *
 * @export
 * @class ClientError
 * @extends {AbstractBaseError}
 */
export class ClientError extends AbstractBaseError {
    constructor(name, cause, httpCode) {
        super(name, cause, httpCode);

        if (typeof name !== 'string') {
            this.name = 'client error';
        }

        if (typeof cause !== 'string') {
            this.cause = 'client error with no cause defined !';
        }

        if (!Object.values(HTTP_CLIENT_CODE).includes(httpCode)) {
            this.httpCode = 400;
        }
    }
}

// ============ PAYMENT & SUBSCRIPTION ERRORS ============

/**
 * ClientPaymentRequiredError (402)
 *
 * Use when: Payment or active subscription is required
 *
 * Examples: Premium features, expired subscriptions, payment processing
 */
export class ClientPaymentRequiredError extends ClientError {
    constructor(cause = 'Payment required to access this resource.') {
        super('PAYMENT REQUIRED', cause, HTTP_CLIENT_CODE.PAYMENT_REQUIRED);
    }
}

// ============ AUTHENTICATION & AUTHORIZATION ERRORS ============

/**
 * ClientUnauthorizedError (401)
 *
 * Use when: User needs to authenticate (login required, token missing/invalid)
 *
 * Examples: Missing JWT token, expired session, invalid credentials
 */
export class ClientUnauthorizedError extends ClientError {
    constructor(
        cause = 'Authentication required. Please provide valid credentials.'
    ) {
        super('UNAUTHORIZED', cause, HTTP_CLIENT_CODE.UNAUTHORIZED);
    }
}

/**
 * ClientForbiddenError (403)
 *
 * Use when: User is authenticated but lacks permission for the resource
 *
 * Examples: Admin-only endpoint accessed by regular user, insufficient role/permissions
 */
export class ClientForbiddenError extends ClientError {
    constructor(
        cause = 'Access denied. You do not have permission to access this resource.'
    ) {
        super('FORBIDDEN', cause, HTTP_CLIENT_CODE.FORBIDDEN);
    }
}

// ============ REQUEST FORMAT & VALIDATION ERRORS ============

/**
 * ClientBadRequestError (400)
 *
 * Use when: Request is malformed, invalid parameters, validation failures
 *
 * Examples: Missing required fields, invalid JSON, wrong data types
 */
export class ClientBadRequestError extends ClientError {
    constructor(cause = 'Invalid request format or parameters.') {
        super('BAD REQUEST', cause, HTTP_CLIENT_CODE.BAD_REQUEST);
    }
}

/**
 * ClientUnprocessableContentError (422)
 *
 * Use when: Request is well-formed but contains semantic errors
 *
 * Examples: Valid JSON but business logic validation fails, duplicate email registration
 */
export class ClientUnprocessableContentError extends ClientError {
    constructor(
        cause = 'Request contains semantic errors that prevent processing.'
    ) {
        super(
            'UNPROCESSABLE CONTENT',
            cause,
            HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
        );
    }
}

/**
 * ClientNotAcceptableError (406)
 *
 * Use when: Server cannot produce content matching client's Accept headers
 *
 * Examples: Client requests XML but server only supports JSON, unsupported media formats
 */
export class ClientNotAcceptableError extends ClientError {
    constructor(
        cause = 'Server cannot produce content in the format requested by client.'
    ) {
        super('NOT ACCEPTABLE', cause, HTTP_CLIENT_CODE.NOT_ACCEPTABLE);
    }
}

/**
 * ClientGoneError (410)
 *
 * Use when: Resource existed before but has been permanently deleted
 *
 * Examples: Deleted user accounts, removed content, deprecated API endpoints
 */
export class ClientGoneError extends ClientError {
    constructor(
        cause = 'The requested resource is no longer available and will not be available again.'
    ) {
        super('GONE', cause, HTTP_CLIENT_CODE.GONE);
    }
}

/**
 * ClientLengthRequiredError (411)
 *
 * Use when: Content-Length header is required but missing
 *
 * Examples: File uploads without size specification, streaming requirements
 */
export class ClientLengthRequiredError extends ClientError {
    constructor(cause = 'Content-Length header is required for this request.') {
        super('LENGTH REQUIRED', cause, HTTP_CLIENT_CODE.LENGTH_REQUIRED);
    }
}

/**
 * ClientPayloadTooLargeError (413)
 *
 * Use when: Request body exceeds server limits
 *
 * Examples: File uploads too large, JSON payloads exceeding limits
 */
export class ClientPayloadTooLargeError extends ClientError {
    constructor(
        cause = 'Request payload is too large for the server to process.'
    ) {
        super('PAYLOAD TOO LARGE', cause, HTTP_CLIENT_CODE.PAYLOAD_TOO_LARGE);
    }
}

/**
 * ClientUriTooLongError (414)
 *
 * Use when: Request URL exceeds server limits
 *
 * Examples: Very long query strings, complex filter parameters
 */
export class ClientUriTooLongError extends ClientError {
    constructor(cause = 'Request URI is too long for the server to process.') {
        super('URI TOO LONG', cause, HTTP_CLIENT_CODE.URI_TOO_LONG);
    }
}

/**
 * ClientUnsupportedMediaTypeError (415)
 *
 * Use when: Request content type is not supported
 *
 * Examples: Sending XML to JSON-only endpoint, unsupported file formats
 */
export class ClientUnsupportedMediaTypeError extends ClientError {
    constructor(
        cause = 'Request content type is not supported by the server.'
    ) {
        super(
            'UNSUPPORTED MEDIA TYPE',
            cause,
            HTTP_CLIENT_CODE.UNSUPPORTED_MEDIA_TYPE
        );
    }
}

/**
 * ClientRangeNotSatisfiableError (416)
 *
 * Use when: Range header cannot be satisfied
 *
 * Examples: Invalid byte ranges for file downloads, pagination out of bounds
 */
export class ClientRangeNotSatisfiableError extends ClientError {
    constructor(cause = 'Range specified in request cannot be satisfied.') {
        super(
            'RANGE NOT SATISFIABLE',
            cause,
            HTTP_CLIENT_CODE.RANGE_NOT_SATISFIABLE
        );
    }
}

/**
 * ClientExpectationFailedError (417)
 *
 * Use when: Expect header requirements cannot be met
 *
 * Examples: Expect: 100-continue cannot be satisfied
 */
export class ClientExpectationFailedError extends ClientError {
    constructor(
        cause = 'Server cannot meet the requirements of the Expect request header.'
    ) {
        super('EXPECTATION FAILED', cause, HTTP_CLIENT_CODE.EXPECTATION_FAILED);
    }
}

/**
 * ClientLockedError (423)
 *
 * Use when: Resource is locked and cannot be accessed
 *
 * Examples: File being edited by another user, resource in maintenance
 */
export class ClientLockedError extends ClientError {
    constructor(cause = 'The requested resource is currently locked.') {
        super('LOCKED', cause, HTTP_CLIENT_CODE.LOCKED);
    }
}

/**
 * ClientUpgradeRequiredError (426)
 *
 * Use when: Client must upgrade to different protocol
 *
 * Examples: HTTP to HTTPS upgrade required, WebSocket upgrade needed
 */
export class ClientUpgradeRequiredError extends ClientError {
    constructor(
        cause = 'Client must upgrade to a different protocol to access this resource.'
    ) {
        super('UPGRADE REQUIRED', cause, HTTP_CLIENT_CODE.UPGRADE_REQUIRED);
    }
}

/**
 * ClientTooManyRequestsError (429)
 *
 * Use when: Client has exceeded rate limits
 *
 * Examples: API rate limiting, spam prevention, DDoS protection
 */
export class ClientTooManyRequestsError extends ClientError {
    constructor(
        cause = 'Too many requests sent in a given amount of time. Please slow down.'
    ) {
        super('TOO MANY REQUESTS', cause, HTTP_CLIENT_CODE.TOO_MANY_REQUESTS);
    }
}

/**
 * ClientRequestHeaderTooLargeError (431)
 *
 * Use when: Request headers are too large
 *
 * Examples: Excessive cookies, very long authorization tokens
 */
export class ClientRequestHeaderTooLargeError extends ClientError {
    constructor(cause = 'Request header fields are too large.') {
        super(
            'REQUEST HEADER FIELDS TOO LARGE',
            cause,
            HTTP_CLIENT_CODE.REQUEST_HEADER_TOO_LARGE
        );
    }
}

// ============ RESOURCE & ROUTING ERRORS ============

/**
 * ClientNotFoundError (404)
 *
 * Use when: Requested resource doesn't exist
 *
 * Examples: Invalid endpoint, user ID not found, deleted resources
 */
export class ClientNotFoundError extends ClientError {
    constructor(cause = 'The requested resource could not be found.') {
        super('NOT FOUND', cause, HTTP_CLIENT_CODE.NOT_FOUND);
    }
}

/**
 * ClientMethodNotAllowedError (405)
 *
 * Use when: HTTP method not supported for the endpoint
 *
 * Examples: POST to a GET-only endpoint, DELETE on read-only resource
 */
export class ClientMethodNotAllowedError extends ClientError {
    constructor(cause = 'HTTP method not allowed for this endpoint.') {
        super('METHOD NOT ALLOWED', cause, HTTP_CLIENT_CODE.METHOD_NOT_ALLOWED);
    }
}

// ============ TIMING & STATE ERRORS ============

/**
 * ClientMethodTimeoutError (408)
 *
 * Use when: Client took too long to send the request
 *
 * Examples: Slow file uploads, client-side network issues
 */
export class ClientMethodTimeoutError extends ClientError {
    constructor(
        cause = 'Request timeout. The client took too long to send the request.'
    ) {
        super('REQUEST TIMEOUT', cause, HTTP_CLIENT_CODE.METHOD_TIMEOUT);
    }
}

/**
 * ClientConflictError (409)
 *
 * Use when: Request conflicts with current resource state
 *
 * Examples: Editing outdated data, duplicate resource creation, version conflicts
 */
export class ClientConflictError extends ClientError {
    constructor(
        cause = 'Request conflicts with the current state of the resource.'
    ) {
        super('CONFLICT', cause, HTTP_CLIENT_CODE.CONFLICT);
    }
}

// ============ PRECONDITION ERRORS ============

/**
 * ClientFailedPreconditionError (412)
 *
 * Use when: Client-specified preconditions are not met
 *
 * Examples: If-Match header doesn't match, If-Unmodified-Since fails
 */
export class ClientFailedPreconditionError extends ClientError {
    constructor(cause = 'Precondition specified in request headers failed.') {
        super(
            'PRECONDITION FAILED',
            cause,
            HTTP_CLIENT_CODE.FAILED_PRECONDITION
        );
    }
}

/**
 * ClientPreconditionRequiredError (428)
 *
 * Use when: Request must include precondition headers
 *
 * Examples: Requiring If-Match for updates to prevent race conditions
 */
export class ClientPreconditionRequiredError extends ClientError {
    constructor(
        cause = 'Request must include precondition headers (If-Match, If-None-Match, etc.).'
    ) {
        super(
            'PRECONDITION REQUIRED',
            cause,
            HTTP_CLIENT_CODE.REQUIRED_PRECONDITION
        );
    }
}

// ============ FUN ERROR ============

/**
 * ClientTeaPotError (418)
 *
 * Use when: April Fools' jokes or indicating the server refuses to brew coffee
 *
 * Examples: Easter eggs, humorous error responses
 */
export class ClientTeaPotError extends ClientError {
    constructor(cause = "I'm a teapot. Cannot brew coffee with a teapot.") {
        super("I'M A TEAPOT", cause, HTTP_CLIENT_CODE.TEA_POT);
    }
}

export default ClientError;
