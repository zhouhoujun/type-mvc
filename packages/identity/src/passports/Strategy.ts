import { Abstract, Inject } from '@tsdi/ioc';
import { IAuthenticator, AuthenticatorToken } from './IAuthenticator';
import { ValidationResult } from './results';
import { Context } from 'koa';

@Abstract()
export abstract class Strategy {
    name: string;

    @Inject(AuthenticatorToken)
    protected authenticator: IAuthenticator;

    public abstract authenticate(ctx: Context, options?: any): Promise<ValidationResult>;
}
