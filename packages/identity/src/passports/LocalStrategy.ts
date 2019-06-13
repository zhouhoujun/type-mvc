import { Strategy } from './Strategy';
import { Context } from 'koa';
import { ValidationResult, FailResult, SuccessResult } from './results';
import { Injectable } from '@tsdi/ioc';


export type LocalVerify = (username: string, password: string) => Promise<{ user, info }>;

@Injectable(Strategy, 'local')
export class LocalStrategy extends Strategy {

    name = 'local';

    constructor(private verify: LocalVerify, private usernameField = 'username', private passwordField = 'password') {
        super();
    }

    async authenticate(ctx: Context, options?: any): Promise<ValidationResult> {
        let username = ctx.body[this.usernameField] || ctx.query[this.usernameField];
        let password = ctx.body[this.passwordField] || ctx.query[this.passwordField];

        let { user, info } = await this.verify(username, password);

        if (!user) {
            // TODO, not sure 401 is the correct meaning
            return new FailResult(info, 401);
        }
        return new SuccessResult(options, user, info);
    }

}
