import { IMvcServer } from './IMvcServer';
import { Abstract, Inject, ContainerToken, IContainer } from '@ts-ioc/core';
import { IConfiguration } from './IConfiguration';

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
    abstract use(middleware: any);
    abstract start(config: IConfiguration);
    abstract stop();
}
