export class HttpError extends Error {

    constructor(public status: number, message?: string) {
        super();

        if (message) {
            this.message = message;
        }
    }

    toString() {
        return `Http Error: ${this.status}, ${this.message}`;
    }

}
