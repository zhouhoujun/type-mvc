import { BootContext, BootOption } from '@tsdi/boot';
import { Injectable, Refs, InjectToken } from '@tsdi/ioc';
import { IConfiguration } from './IConfiguration';
import { MvcServer } from './MvcServer';
import * as Koa from 'koa';
import * as http from 'http';
import * as https from 'https';

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

    koa?: Koa;

    httpServer?: http.Server | https.Server;

    listener?: Function;
}

/**
 * mvc context token.
 */
export const MvcContextToken = new InjectToken<MvcContext>('MVC_Context');

@Injectable()
@Refs(MvcServer, BootContext)
@Refs('@Bootstrap', BootContext)
export class MvcContext extends BootContext {

    private koa: Koa;
    getKoa(): Koa {
        if (!this.koa) {
            this.koa = new Koa();
        }
        return this.koa;
    }
    /**
     * http server.
     *
     * @type {(http.Server | https.Server)}
     * @memberof MvcContext
     */
    httpServer: http.Server | https.Server;

    /**
     * cusmtom listener.
     *
     * @type {Function}
     * @memberof MvcContext
     */
    listener?: Function;
}
