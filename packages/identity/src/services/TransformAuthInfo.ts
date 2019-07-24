import { Abstract } from '@tsdi/ioc';
import { Context } from 'koa';
import { ITransformAuthInfo } from '../passports';

@Abstract()
export abstract class TransformAuthInfo implements ITransformAuthInfo {
    abstract authInfo(user: any, ctx: Context): Promise<any>;
}
