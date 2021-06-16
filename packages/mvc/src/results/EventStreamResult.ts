import { IContext } from '../IContext';
import { ResultValue } from './ResultValue';

/**
 * EventStream Result
 *
 * @export
 * @class EventStreamResult
 * @extends {ResultValue}
 */
export class EventStreamResult extends ResultValue {
    constructor(private message: string) {
        super('text/event-stream');
    }
    async sendValue(ctx: IContext) {
        ctx.res.write(this.message);
    }
}