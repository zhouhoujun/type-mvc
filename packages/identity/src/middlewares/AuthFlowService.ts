import { Abstract } from '@tsdi/ioc';
import { IContext } from '@mvx/mvc';

/**
 * AuthFlow service.
 */
@Abstract()
export abstract class AuthFlowService {
    abstract auth(ctx: IContext, next?: () => Promise<void>): Promise<void>;
}
