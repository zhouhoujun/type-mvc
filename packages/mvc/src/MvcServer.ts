import * as http from 'http';
import { IMvcServer } from './IMvcServer';
import { Providers, Abstract } from '@ts-ioc/core';
import { RunnerToken } from '@ts-ioc/bootstrap';
import { ApplicationToken } from './IApplication';

/**
 * base mvc server.
 *
 * @export
 * @abstract
 * @class MvcServer
 * @implements {IMvcServer}
 */
@Abstract()
@Providers([
    { provide: RunnerToken, useExisting: ApplicationToken }
])
export abstract class MvcServer implements IMvcServer {
    constructor() {
    }
    abstract use(middleware: any);
    abstract callback(): (request: http.IncomingMessage, response: http.ServerResponse) => void;
}