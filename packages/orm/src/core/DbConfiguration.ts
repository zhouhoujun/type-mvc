import { Singleton } from '@ts-ioc/core';
import { IDbConfiguration, DbConfigurationToken } from './IDbConfiguration';


@Singleton(DbConfigurationToken)
export class DbConfiguration implements IDbConfiguration {
    constructor() {

    }

    connectionString: string;
    debug = true;

    models?: string | string[] = [];
    logOptions: {
        appenders: {
            filelog: {
                type: 'dateFile',
                pattern: '-yyyyMMdd.log',
                filename: 'logs/orms',
                maxLogSize: 20480,
                backups: 3,
                alwaysIncludePattern: true
            }
        },
        categories: {
            default: { appenders: ['filelog'], level: 'error' }
        }
    }
}
