
/**
 * request method.
 */
export enum RequestMethod {
    Get,
    Post,
    Put,
    Delete,
    Options,
    Head,
    Patch
}

/**
 * convert method to string.
 *
 * @export
 * @param {RequestMethod} [method]
 * @returns {string}
 */
export function methodToString(method?: RequestMethod): string {
    switch (method) {
        case RequestMethod.Get:
            return 'GET';
        case RequestMethod.Post:
            return 'POST';
        case RequestMethod.Put:
            return 'PUT';
        case RequestMethod.Delete:
            return 'DELETE';
        case RequestMethod.Options:
            return 'OPTIONS';
        case RequestMethod.Head:
            return 'HEAD';
        case RequestMethod.Patch:
            return 'PATCH';
        default:
            return 'GET';
    }
}

/**
 * parse string to RequestMethod
 *
 * @export
 * @param {string} [method]
 * @returns {RequestMethod}
 */
export function parseRequestMethod(method?: string): RequestMethod {
    method = (method || '').toUpperCase();
    switch (method) {
        case 'GET':
            return RequestMethod.Get;
        case 'POST':
            return RequestMethod.Post;
        case 'PUT':
            return RequestMethod.Put;
        case 'DELETE':
            return RequestMethod.Delete;
        case 'OPTIONS':
            return RequestMethod.Options;
        case 'HEAD':
            return RequestMethod.Head;
        case 'PATCH':
            return RequestMethod.Patch;
        default:
            return RequestMethod.Get;
    }
}
