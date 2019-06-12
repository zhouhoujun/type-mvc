import { Strategy, ValidationResult } from '../passports';
import { Context } from 'koa';


export class OIDCStrategy extends Strategy {
    public authenticate(ctx: Context, options?: any): Promise<ValidationResult> {
        throw new Error("Method not implemented.");
    }

}
