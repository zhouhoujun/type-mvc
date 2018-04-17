import { Singleton, Inject, IContainer, symbols  } from '@ts-ioc/core';
import { LoggerAspect } from '@ts-ioc/logs'
import { Aspect, Around, Joinpoint } from '@ts-ioc/aop';
import { MvcSymbols } from '../util/index';
import { IConfiguration } from '../IConfiguration';

@Singleton
@Aspect
export class DebugLogAspect extends LoggerAspect {

    constructor( @Inject(symbols.IContainer) container: IContainer) {
        super(container);
    }

    @Around('execution(*.*)')
    logging(joinPoint: Joinpoint) {
        this.processLog(joinPoint);
    }
}
