import { BootContext, BootOption } from '@tsdi/boot';
import { Injectable, Refs, InjectToken } from '@tsdi/ioc';
import { IConfiguration } from './IConfiguration';
import { MvcServer } from './MvcServer';

/**
 * mvc boot option
 *
 * @export
 * @interface MvcOptions
 * @extends {BootOption}
 */
export interface MvcOptions extends BootOption {
/**
     * annoation metadata config.
     *
     * @type {AnnotationConfigure<any>}
     * @memberof AnnoationContext
     */
    annoation?: IConfiguration;
    /**
     * custom configures
     *
     * @type {((string | IConfiguration)[])}
     * @memberof BootOptions
     */
    configures?: (string | IConfiguration)[];
}

/**
 * mvc context token.
 */
export const MvcContextToken = new InjectToken<MvcContext>('MVC_Context');

@Injectable()
@Refs(MvcServer, BootContext)
@Refs('@Bootstrap', BootContext)
export class MvcContext extends BootContext {

}
