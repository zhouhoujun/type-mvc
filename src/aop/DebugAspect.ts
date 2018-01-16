import { Aspect, Singleton, Inject, IContainer, symbols, Around, Joinpoint, JoinpointState } from 'tsioc';
import { mvcSymbols } from '../index';
import { IConfiguration } from '../Configuration';
import { ILoggerManger, ILogger } from '../logs/index';


@Singleton
@Aspect
export class DebugAspect {

    private logger: ILogger;
    constructor( @Inject(symbols.IContainer) private container: IContainer, @Inject(mvcSymbols.IConfiguration) private config: IConfiguration) {
        let logManger = this.container.resolve<ILoggerManger>(config.logLib || 'console');
        logManger.configure(config.logConfig);
        this.logger = logManger.getLogger();
    }

    @Around('execution(*.*)')
    log(joinPoint: Joinpoint) {
        switch (joinPoint.state) {
            case JoinpointState.Before:
            case JoinpointState.After:
            case JoinpointState.AfterReturning:
                this.logger.debug(this.config.logFormat, joinPoint.fullName, joinPoint.state, joinPoint.args, joinPoint.returning, joinPoint.throwing);
                break;
            case JoinpointState.Pointcut:
                this.logger.info(this.config.logFormat, joinPoint.fullName, joinPoint.state, joinPoint.args, joinPoint.returning, joinPoint.throwing);
                break;

            case JoinpointState.AfterThrowing:
                this.logger.error(this.config.logFormat, joinPoint.fullName, joinPoint.state, joinPoint.args, joinPoint.returning, joinPoint.throwing);
                break;

        }
    }
}
