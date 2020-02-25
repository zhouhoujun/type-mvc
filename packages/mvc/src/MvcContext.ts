import { Injectable, Refs, InjectToken } from '@tsdi/ioc';
import { BootContext, BootOption, ProcessRunRootToken, ConfigureManager } from '@tsdi/boot';
import { runMainPath } from '@tsdi/platform-server';
import { IConfiguration } from './IConfiguration';
import * as Koa from 'koa';
import * as http from 'http';
import * as https from 'https';
import { MvcModuleMetadata } from './metadata/MvcModuleMetadata';
import { IMvcServer } from './IMvcServer';

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
     * @type {IConfiguration}
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
export const MvcContextToken = new InjectToken<MvcContext>('MVC_CONTEXT');

/**
 * mvc application context.
 *
 * @export
 * @class MvcContext
 * @extends {BootContext}
 */
@Injectable()
@Refs('@MvcModule', BootContext)
export class MvcContext extends BootContext<MvcOptions> {

    /**
     * boot startup service instance.
     *
     * @type {IStartup}
     * @memberof BootContext
     */
    getStartup(): IMvcServer {
        return super.getStartup() as IMvcServer;
    }

    getAnnoation(): MvcModuleMetadata {
        return super.getAnnoation();
    }
    /**
     * configuration, meger configure and annoation metadata.
     *
     * @type {IConfiguration}
     * @memberof MvcContext
     */
    getConfiguration(): IConfiguration {
        return super.getConfiguration();
    }

    /**
     * get configure manager.
     *
     * @returns {ConfigureManager<IConfiguration>}
     * @memberof BootContext
     */
    getConfigureManager(): ConfigureManager<IConfiguration> {
        return super.getConfigureManager();
    }

    private koa: Koa;
    getKoa(): Koa {
        if (!this.koa) {
            this.koa = new Koa();
        }
        return this.koa;
    }

    app: Koa;

    getRootPath() {
        if (this.baseURL) {
            return this.baseURL;
        }
        return this.getContainer().get(ProcessRunRootToken) || runMainPath();
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
