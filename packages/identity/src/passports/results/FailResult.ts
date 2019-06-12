import { ValidationResult } from './ValidationResult';
import { Context } from 'koa';

/**
 * Fail authentication, with optional `challenge` and `status`, defaulting
 * to 401.
 *
 * Strategies should return this action to fail an authentication attempt.
 *
 * @param {String} challenge
 * @param {Number} status
 * @api public
 */
export class FailResult extends ValidationResult {

    constructor(public challenge: string, public status: number) {
        super();
    }

    async execute(ctx: Context, next: () => Promise<void>): Promise<void> {
        ctx.failures.push({ challenge: this.challenge, status: this.status });
    }
}
