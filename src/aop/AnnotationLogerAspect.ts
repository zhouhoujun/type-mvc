import { Aspect, Singleton, Inject, IContainer, symbols, Around, Joinpoint, JoinpointState, Pointcut } from 'tsioc';
import { mvcSymbols } from '../util/index';
import { IConfiguration } from '../Configuration';
import { ILoggerManger, ILogger } from '../logs/index';
import { LoggerMetadata } from '../core/decorators/index';


@Singleton
@Aspect
export class AnnotationLogerAspect {

    private logger: ILogger;
    private logManger: ILoggerManger;
    constructor( @Inject(symbols.IContainer) private container: IContainer, @Inject(mvcSymbols.IConfiguration) private config: IConfiguration) {
        this.logManger = this.container.resolve<ILoggerManger>(config.logLib || 'console');
        this.logManger.configure(config.logConfig);
        this.logger = this.logManger.getLogger();
    }

    @Pointcut('@annotation(Logger)', 'annotation')
    log(joinPoint: Joinpoint, annotation: LoggerMetadata[]) {
        if (annotation && annotation.length) {
            annotation.forEach(logmeta => {
                let canlog = false;
                if (logmeta.express && logmeta.express(joinPoint)) {
                    canlog = true;
                } else if (!logmeta.express) {
                    canlog = true;
                }
                if (canlog) {
                    this.dolog(logmeta.logname ? this.logManger.getLogger(logmeta.logname) : this.logger, joinPoint);
                }
            })

        } else {
            this.dolog(this.logger, joinPoint);
        }

    }

    dolog(logger: ILogger, joinPoint: Joinpoint) {
        switch (joinPoint.state) {
            case JoinpointState.Before:
            case JoinpointState.After:
            case JoinpointState.AfterReturning:
                this.logger.info(joinPoint.fullName, joinPoint.state, joinPoint.args, joinPoint.returning);
                break;
            case JoinpointState.Pointcut:
                this.logger.info(joinPoint.fullName, joinPoint.state, joinPoint.args, joinPoint.returning);
                break;

            case JoinpointState.AfterThrowing:
                this.logger.error(joinPoint.fullName, joinPoint.state, joinPoint.args, joinPoint.returning);
                break;

        }
    }
}
