import { ITransformAuthInfo } from '@mvx/mvc';
import { Abstract } from '@tsdi/ioc';
import { Context } from 'koa';

@Abstract()
export abstract class TransformAuthInfo implements ITransformAuthInfo {
    abstract authInfo(user: any, ctx: Context): Promise<any>;
}
