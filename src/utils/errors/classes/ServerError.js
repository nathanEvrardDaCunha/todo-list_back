import AbstractBaseError from './BaseError.js';
import HTTP_SERVER_CODE from '../constants/serverStatusCode.js';

/**
 * Used when verifying specific error is an extension of ServerError
 *
 * @export
 * @class ServerError
 * @extends {AbstractBaseError}
 */
export class ServerError extends AbstractBaseError {
    constructor(name, cause, httpCode) {
        super(name, cause, httpCode);

        if (typeof name !== 'string') {
            this.name = 'server error';
        }

        if (typeof cause !== 'string') {
            this.cause = 'server error with no cause defined !';
        }

        if (!Object.values(HTTP_SERVER_CODE).includes(httpCode)) {
            this.httpCode = 500;
        }
    }
}

// ============ GENERAL SERVER ERRORS ============

/**
 * ServerInternalError (500)
 *
 * Use when: Unexpected server-side errors, unhandled exceptions
 *
 * Examples: Database crashes, unhandled promise rejections, code bugs
 */
export class ServerInternalError extends ServerError {
    constructor(cause = 'An unexpected error occurred on the server.') {
        super(
            'INTERNAL SERVER ERROR',
            cause,
            HTTP_SERVER_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

/**
 * ServerNotImplementedError (501)
 *
 * Use when: Server doesn't support the requested functionality
 *
 * Examples: Unimplemented HTTP methods, missing features, placeholder endpoints
 */
export class ServerNotImplementedError extends ServerError {
    constructor(
        cause = 'This functionality is not yet implemented on the server.'
    ) {
        super('NOT IMPLEMENTED', cause, HTTP_SERVER_CODE.NOT_IMPLEMENTED);
    }
}

// ============ GATEWAY & PROXY ERRORS ============

/**
 * ServerBadGatewayError (502)
 *
 * Use when: Server acting as gateway receives invalid response from upstream
 *
 * Examples: Microservice communication failures, API gateway issues, proxy errors
 */
export class ServerBadGatewayError extends ServerError {
    constructor(cause = 'Invalid response received from upstream server.') {
        super('BAD GATEWAY', cause, HTTP_SERVER_CODE.BAD_GATEWAY);
    }
}

/**
 * ServerGatewayTimeoutError (504)
 *
 * Use when: Gateway timeout waiting for upstream server response
 *
 * Examples: Slow database queries, external API timeouts, network delays
 */
export class ServerGatewayTimeoutError extends ServerError {
    constructor(
        cause = 'Timeout occurred while waiting for upstream server response.'
    ) {
        super('GATEWAY TIMEOUT', cause, HTTP_SERVER_CODE.GATEWAY_TIMEOUT);
    }
}

// ============ SERVICE AVAILABILITY ERRORS ============

/**
 * ServerServiceUnavailableError (503)
 *
 * Use when: Server temporarily cannot handle requests
 *
 * Examples: Maintenance mode, overloaded server, temporary outages
 */
export class ServerServiceUnavailableError extends ServerError {
    constructor(
        cause = 'Service is temporarily unavailable. Please try again later.'
    ) {
        super(
            'SERVICE UNAVAILABLE',
            cause,
            HTTP_SERVER_CODE.SERVICE_UNAVAILABLE
        );
    }
}

// ============ PROTOCOL ERRORS ============

/**
 * ServerHttpVersionNotSupportedError (505)
 *
 * Use when: HTTP version in request is not supported
 *
 * Examples: Very old HTTP versions, unsupported protocol features
 */
export class ServerHttpVersionNotSupportedError extends ServerError {
    constructor(cause = 'HTTP version used in the request is not supported.') {
        super(
            'HTTP VERSION NOT SUPPORTED',
            cause,
            HTTP_SERVER_CODE.HTTP_VERSION_NOT_SUPPORTED
        );
    }
}

// ============ CONFIGURATION & RESOURCE ERRORS ============

/**
 * ServerVariantAlsoNegotiatesError (506)
 *
 * Use when: Server configuration error in content negotiation
 *
 * Examples: Circular reference in content negotiation, misconfigured variants
 */
export class ServerVariantAlsoNegotiatesError extends ServerError {
    constructor(cause = 'Server configuration error in content negotiation.') {
        super(
            'VARIANT ALSO NEGOTIATES',
            cause,
            HTTP_SERVER_CODE.VARIANT_ALSO_NEGOTIATES
        );
    }
}

/**
 * ServerInsufficientStorageError (507)
 *
 * Use when: Server cannot store the representation needed
 *
 * Examples: Disk space full, storage quota exceeded, temporary storage issues
 */
export class ServerInsufficientStorageError extends ServerError {
    constructor(
        cause = 'Server has insufficient storage to complete the request.'
    ) {
        super(
            'INSUFFICIENT STORAGE',
            cause,
            HTTP_SERVER_CODE.INSUFFICIENT_STORAGE
        );
    }
}

/**
 * ServerLoopDetectedError (508)
 *
 * Use when: Infinite loop detected in request processing
 *
 * Examples: Circular redirects, recursive processing, endless loops
 */
export class ServerLoopDetectedError extends ServerError {
    constructor(
        cause = 'Infinite loop detected while processing the request.'
    ) {
        super('LOOP DETECTED', cause, HTTP_SERVER_CODE.LOOP_DETECTED);
    }
}

/**
 * ServerNotExtendedError (510)
 *
 * Use when: Further extensions to request are required
 *
 * Examples: Policy requirements not met, additional extensions needed
 */
export class ServerNotExtendedError extends ServerError {
    constructor(
        cause = 'Further extensions to the request are required for the server to fulfill it.'
    ) {
        super('NOT EXTENDED', cause, HTTP_SERVER_CODE.NOT_EXTENDED);
    }
}

/**
 * ServerNetworkAuthRequiredError (511)
 *
 * Use when: Client needs network authentication
 *
 * Examples: Captive portal, network-level authentication required
 */
export class ServerNetworkAuthRequiredError extends ServerError {
    constructor(
        cause = 'Network authentication is required to access this resource.'
    ) {
        super(
            'NETWORK AUTHENTICATION REQUIRED',
            cause,
            HTTP_SERVER_CODE.NETWORK_AUTH_REQUIRED
        );
    }
}

export default ServerError;
