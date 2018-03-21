import { ILoggerManger, ILogger, Injectable, Singleton, NonePointcut } from 'tsioc';

@NonePointcut
@Singleton
@Injectable('log4js')
export class Log4jsAdapter implements ILoggerManger {
    private _log4js: any;
    constructor() {
    }
    getLog4js() {
        if (!this._log4js) {
            this._log4js = require('log4js');
        }
        return this._log4js;
    }
    configure(config: any) {
        this.getLog4js().configure(config);
    }
    getLogger(name?: string): ILogger {
        return this.getLog4js().getLogger(name);
    }

}
