import { Type } from '@tsdi/ioc';
import { DIModuleMetadata } from '@tsdi/boot';
import { MvcMiddlewareType } from '../middlewares/IMiddleware';
import { IConfiguration } from '../IConfiguration';
import { MvcContext } from '../MvcContext';

export interface MvcModuleMetadata extends DIModuleMetadata, IConfiguration {
    contextType?: Type<MvcContext>;
    middlewares?: MvcMiddlewareType[];
    passports?: any;
}
