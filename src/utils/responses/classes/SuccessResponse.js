import AbstractBaseResponse from './BaseResponse.js';
import HTTP_SUCCESS_CODE from '../constants/successStatusCode.js';

class SuccessResponse extends AbstractBaseResponse {
    constructor(name, message, httpCode, data = null) {
        super(name, message, httpCode, data);

        if (typeof name !== 'string') {
            this.name = 'success';
        }

        if (typeof message !== 'string') {
            this.message = 'Operation completed successfully';
        }

        if (!Object.values(HTTP_SUCCESS_CODE).includes(httpCode)) {
            this.httpCode = 200;
        }
    }
}

// ============ STANDARD SUCCESS RESPONSES ============

/**
 * SuccessOkResponse (200)
 *
 * Use when: Standard successful request with content
 *
 * Examples: GET requests, successful data retrieval, general success operations
 */
export class SuccessOkResponse extends SuccessResponse {
    constructor(message = 'Request completed successfully', data = null) {
        super('SUCCESS', message, HTTP_SUCCESS_CODE.OK, data);
    }
}

/**
 * SuccessCreatedResponse (201)
 *
 * Use when: Resource has been successfully created
 *
 * Examples: POST requests creating new users, new posts, new records
 */
export class SuccessCreatedResponse extends SuccessResponse {
    constructor(message = 'Resource created successfully', data = null) {
        super('CREATED', message, HTTP_SUCCESS_CODE.CREATED, data);
    }
}

/**
 * SuccessAcceptedResponse (202)
 *
 * Use when: Request accepted for processing but not completed yet
 *
 * Examples: Async operations, queued tasks, background processing
 */
export class SuccessAcceptedResponse extends SuccessResponse {
    constructor(message = 'Request accepted for processing', data = null) {
        super('ACCEPTED', message, HTTP_SUCCESS_CODE.ACCEPTED, data);
    }
}

/**
 * SuccessNonAuthoritativeInfoResponse (203)
 *
 * Use when: Information from third-party source
 *
 * Examples: Cached responses, proxy responses, transformed content
 */
export class SuccessNonAuthoritativeInfoResponse extends SuccessResponse {
    constructor(
        message = 'Information from non-authoritative source',
        data = null
    ) {
        super(
            'NON-AUTHORITATIVE INFORMATION',
            message,
            HTTP_SUCCESS_CODE.NON_AUTHORITATIVE_INFO,
            data
        );
    }
}

/**
 * SuccessNoContentResponse (204)
 *
 * Use when: Successful operation with no content to return
 *
 * Examples: DELETE operations, PUT updates, successful actions without response data
 */
export class SuccessNoContentResponse extends SuccessResponse {
    constructor(message = 'Operation completed successfully') {
        super('NO CONTENT', message, HTTP_SUCCESS_CODE.NO_CONTENT, null);
    }
}

/**
 * SuccessResetContentResponse (205)
 *
 * Use when: Success and client should reset document view
 *
 * Examples: Form submissions, clearing form data, resetting UI state
 */
export class SuccessResetContentResponse extends SuccessResponse {
    constructor(message = 'Content reset required', data = null) {
        super('RESET CONTENT', message, HTTP_SUCCESS_CODE.RESET_CONTENT, data);
    }
}

/**
 * SuccessPartialContentResponse (206)
 *
 * Use when: Partial content delivered (range requests)
 *
 * Examples: File downloads with range headers, video streaming, paginated content
 */
export class SuccessPartialContentResponse extends SuccessResponse {
    constructor(message = 'Partial content delivered', data = null) {
        super(
            'PARTIAL CONTENT',
            message,
            HTTP_SUCCESS_CODE.PARTIAL_CONTENT,
            data
        );
    }
}

// ============ WEBDAV & ADVANCED RESPONSES ============

/**
 * SuccessMultiStatusResponse (207)
 *
 * Use when: Multiple operations with different status codes (WebDAV)
 *
 * Examples: Bulk operations, batch processing, multiple resource operations
 */
export class SuccessMultiStatusResponse extends SuccessResponse {
    constructor(
        message = 'Multiple operations completed with different results',
        data = null
    ) {
        super('MULTI-STATUS', message, HTTP_SUCCESS_CODE.MULTI_STATUS, data);
    }
}

/**
 * SuccessAlreadyReportedResponse (208)
 *
 * Use when: Members already enumerated in previous reply (WebDAV)
 *
 * Examples: Avoiding duplicate entries in collections, preventing circular references
 */
export class SuccessAlreadyReportedResponse extends SuccessResponse {
    constructor(
        message = 'Members already reported in previous response',
        data = null
    ) {
        super(
            'ALREADY REPORTED',
            message,
            HTTP_SUCCESS_CODE.ALREADY_REPORTED,
            data
        );
    }
}

/**
 * SuccessImUsedResponse (226)
 *
 * Use when: Delta encoding response (HTTP Delta encoding)
 *
 * Examples: Optimized responses using delta compression, bandwidth optimization
 */
export class SuccessImUsedResponse extends SuccessResponse {
    constructor(message = 'IM used for delta encoding', data = null) {
        super('IM USED', message, HTTP_SUCCESS_CODE.IM_USED, data);
    }
}

export default SuccessResponse;
