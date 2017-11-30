export class HttpError extends Error {

    constructor(public code: number, message?: string) {
        super();

        if (message) {
            this.message = message;
        }
    }

    toString() {
        return `Http Error: ${this.code}, ${this.message}`;
    }

}
