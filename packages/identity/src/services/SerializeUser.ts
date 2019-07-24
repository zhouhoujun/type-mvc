import { Abstract } from '@tsdi/ioc';
import { Context } from 'koa';
import { ISerializeUser } from '../passports';

@Abstract()
export abstract class SerializeUser implements ISerializeUser {
    abstract serializeUser(user: any, ctx: Context): Promise<any>;
}
