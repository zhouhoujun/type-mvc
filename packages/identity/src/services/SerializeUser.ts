import { ISerializeUser } from '@mvx/mvc';
import { Abstract } from '@tsdi/ioc';
import { Context } from 'koa';

@Abstract()
export abstract class SerializeUser implements ISerializeUser {
    abstract serializeUser(user: any, ctx: Context): Promise<any>;
}
