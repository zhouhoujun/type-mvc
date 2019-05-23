import { IMvcServer } from './IMvcServer';
import { ContainerToken, IContainer } from '@tsdi/core';
import { IConfiguration } from './IConfiguration';
import { Abstract, Inject } from '@tsdi/ioc';

/**
 * base mvc server.
 *
 * @export
 * @abstract
 * @class MvcServer
 * @implements {IMvcServer}
 */
@Abstract()
export abstract class MvcServer implements IMvcServer {
    @Inject(ContainerToken)
    container: IContainer;

    constructor() {
    }

    abstract init(config: IConfiguration): void;

    abstract getHttpServer(): any;
    abstract use(middleware: any);
    abstract useFac(middlewareFactory: (core?: any, httpServer?: any) => any);
    abstract start();
    abstract stop();
}
