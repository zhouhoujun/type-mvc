import { IDeserializeUser } from '@mvx/mvc';
import { Abstract } from '@tsdi/ioc';
import { Context } from 'koa';

@Abstract()
export abstract class DeserializeUser implements IDeserializeUser {
    abstract deserializeUser(obj: any, ctx: Context): Promise<any>;
}
