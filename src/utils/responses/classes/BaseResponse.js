export default class AbstractBaseResponse {
    name = '';
    message = '';
    httpCode = 200;
    data = null;
    timestamp = null;

    constructor(name, message, httpCode, data = null) {
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;
        this.message = message;
        this.httpCode = httpCode;
        this.data = data;
        this.timestamp = new Date().toISOString();
    }

    toJSON() {
        return {
            success: true,
            name: this.name,
            message: this.message,
            httpCode: this.httpCode,
            data: this.data,
            timestamp: this.timestamp,
        };
    }
}
