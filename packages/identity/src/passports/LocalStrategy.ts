import { Component, Input, AfterInit } from '@tsdi/components';
import { IContext } from '@mvx/mvc';
import { Strategy } from './Strategy';
import { IStrategyOption } from './IAuthenticator';
import { Context } from 'koa';
import { ValidationResult, FailResult, SuccessResult } from './results';


/**
 * local verify.
 */
export type LocalVerify = (username: string, password: string, ctx: IContext) => Promise<{ user, info }>;

/**
 * LocalStrategy Option
 *
 * @export
 * @interface LocalStrategyOption
 * @extends {IStrategyOption}
 */
export interface LocalStrategyOption extends IStrategyOption {
    usernameField?: string;
    passwordField?: string;
    verify: LocalVerify
}


/**
 * Local authenticate strategy
 *
 * @export
 * @class LocalStrategy
 * @extends {Strategy}
 * @implements {AfterInit}
 */
@Component({
    selector: 'local'
})
export class LocalStrategy extends Strategy implements AfterInit {

    @Input() protected verify: LocalVerify;
    @Input() protected usernameField;
    @Input() protected passwordField;

    async onAfterInit(): Promise<void> {
        if (!this.name) {
            this.name = 'local';
        }
        if (!this.usernameField) {
            this.usernameField = 'username';
        }
        if (!this.passwordField) {
            this.passwordField = 'password';
        }
    }

    async authenticate(ctx: Context, options?: any): Promise<ValidationResult> {
        let username = ctx.request.body[this.usernameField] || ctx.query[this.usernameField];
        let password = ctx.request.body[this.passwordField] || ctx.query[this.passwordField];

        let { user, info } = await this.verify(username, password, ctx as IContext);

        if (!user) {
            // TODO, not sure 401 is the correct meaning
            return new FailResult(info, 401);
        }
        return new SuccessResult(options, user, info);
    }

}
