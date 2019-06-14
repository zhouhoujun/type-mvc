import { Abstract, Inject } from '@tsdi/ioc';
import { IAuthenticator, AuthenticatorToken } from './IAuthenticator';
import { ValidationResult } from './results';
import { Context } from 'koa';
import { IStrategy } from './IStrategy';
import { Input } from '@tsdi/components';

@Abstract()
export abstract class Strategy implements IStrategy {

    @Input()
    name: string;

    @Inject(AuthenticatorToken)
    protected authenticator: IAuthenticator;

    abstract authenticate(ctx: Context, options?: any): Promise<ValidationResult>;
}
