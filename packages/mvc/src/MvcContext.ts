import { BootContext, BootOption, ProcessRunRootToken, Service } from '@tsdi/boot';
import { Injectable, Refs, InjectToken } from '@tsdi/ioc';
import { IConfiguration } from './IConfiguration';
import * as Koa from 'koa';
import { Application } from 'koa';
import * as http from 'http';
import * as https from 'https';
import { runMainPath } from '@tsdi/platform-server';
import { ILoggerManager } from '@tsdi/logs';

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
@Refs('@MvcModule', BootContext)
export class MvcContext extends BootContext {

    /**
     * logManager
     *
     * @type {ILoggerManager}
     * @memberof MvcContext
     */
    logManager: ILoggerManager;
    /**
     * runable.
     *
     * @type {Service<any>}
     * @memberof MvcContext
     */
    runnable: Service<any>;
    /**
     * configuration, meger configure and annoation metadata.
     *
     * @type {IConfiguration}
     * @memberof MvcContext
     */
    configuration: IConfiguration;

    private koa: Koa;
    getKoa(): Koa {
        if (!this.koa) {
            this.koa = new Koa();
        }
        return this.koa;
    }

    app: Application;

    getRootPath() {
        if (this.baseURL) {
            return this.baseURL;
        }
        return this.getRaiseContainer().get(ProcessRunRootToken) || runMainPath();
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
