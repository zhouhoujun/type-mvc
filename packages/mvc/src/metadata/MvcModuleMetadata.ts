import { DIModuleMetadata } from '@tsdi/boot';
import { MvcMiddlewareType } from '../middlewares';
import { IConfiguration } from '../IConfiguration';
import { MvcContext } from '../MvcContext';
import { Type } from '@tsdi/ioc';

export interface MvcModuleMetadata extends DIModuleMetadata, IConfiguration {
    contextType?: Type<MvcContext>;
    middlewares?: MvcMiddlewareType[]
}
