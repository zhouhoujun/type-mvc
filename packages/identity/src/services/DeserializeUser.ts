
import { Abstract } from '@tsdi/ioc';
import { Context } from 'koa';
import { IDeserializeUser } from '../passports';

@Abstract()
export abstract class DeserializeUser implements IDeserializeUser {
    abstract deserializeUser(obj: any, ctx: Context): Promise<any>;
}
