import { Injectable, Singleton } from 'tsioc';
import { ILoggerManger } from './ILoggerManger';
import { ILogger } from './ILogger';

@Singleton
@Injectable('console')
export class ConsoleLogManager implements ILoggerManger {
    private logger: ILogger;
    constructor() {
        this.logger = new ConsoleLog();
    }
    configure(config: any) {

    }
    getLogger(name?: string): ILogger {
        return this.logger;
    }

}


export class ConsoleLog implements ILogger {

    level: string;

    log(...args: any[]): void {
        console.log(...args);
    }
    trace(message: string, ...args: any[]): void {
        console.trace(...args);
    }
    debug(message: string, ...args: any[]): void {
        console.debug(...args);
    }
    info(message: string, ...args: any[]): void {
        console.info(...args);
    }
    warn(message: string, ...args: any[]): void {
        console.warn(...args);
    }
    error(message: string, ...args: any[]): void {
        console.error(...args);
    }
    fatal(message: string, ...args: any[]): void {
        console.error(...args);
    }
}
