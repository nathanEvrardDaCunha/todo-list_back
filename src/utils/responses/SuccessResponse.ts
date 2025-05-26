import BaseResponse from './BaseResponse.js';
import { SUCCESS_CODE } from './responseConstants.js';

class SuccessResponse extends BaseResponse {
    constructor(name: string, message: string, httpCode: number, data: any = null) {
        super(name, message, httpCode, data);

        if (typeof name !== 'string') {
            this.name = 'success';
        }

        if (typeof message !== 'string') {
            this.message = 'Operation completed successfully';
        }

        if (!(Object.values(SUCCESS_CODE) as number[]).includes(httpCode)) {
            this.httpCode = 200;
        }
    }
}

// ============ STANDARD SUCCESS RESPONSES ============

export class OkResponse extends SuccessResponse {
    constructor(message: string = 'Request completed successfully', data: any = null) {
        super('SUCCESS', message, SUCCESS_CODE.OK, data);
    }
}

export class CreatedResponse extends SuccessResponse {
    constructor(message: string = 'Resource created successfully', data: any = null) {
        super('CREATED', message, SUCCESS_CODE.CREATED, data);
    }
}

export class AcceptedResponse extends SuccessResponse {
    constructor(message: string = 'Request accepted for processing', data: any = null) {
        super('ACCEPTED', message, SUCCESS_CODE.ACCEPTED, data);
    }
}

export class UnauthoritativeInfoResponse extends SuccessResponse {
    constructor(message: string = 'Information from non-authoritative source', data: any = null) {
        super('NON-AUTHORITATIVE INFORMATION', message, SUCCESS_CODE.UNAUTHORITATIVE_INFO, data);
    }
}

export class NoContentResponse extends SuccessResponse {
    constructor(message: string = 'Operation completed successfully') {
        super('NO CONTENT', message, SUCCESS_CODE.NO_CONTENT, null);
    }
}

export class ResetContentResponse extends SuccessResponse {
    constructor(message: string = 'Content reset required', data: any = null) {
        super('RESET CONTENT', message, SUCCESS_CODE.RESET_CONTENT, data);
    }
}

export class PartialContentResponse extends SuccessResponse {
    constructor(message: string = 'Partial content delivered', data: any = null) {
        super('PARTIAL CONTENT', message, SUCCESS_CODE.PARTIAL_CONTENT, data);
    }
}

// ============ WEBDAV & ADVANCED RESPONSES ============

export class MultiStatusResponse extends SuccessResponse {
    constructor(message: string = 'Multiple operations completed with different results', data: any = null) {
        super('MULTI-STATUS', message, SUCCESS_CODE.MULTI_STATUS, data);
    }
}

export class AlreadyReportedResponse extends SuccessResponse {
    constructor(message: string = 'Members already reported in previous response', data: any = null) {
        super('ALREADY REPORTED', message, SUCCESS_CODE.ALREADY_REPORTED, data);
    }
}

export class ImUsedResponse extends SuccessResponse {
    constructor(message: string = 'IM used for delta encoding', data: any = null) {
        super('IM USED', message, SUCCESS_CODE.IM_USED, data);
    }
}
