import { InjectModuleValidateToken, Singleton, BaseModuelValidate } from '@ts-ioc/core';
import { App } from '../decorators';


export const AppModuleValidateToken = new InjectModuleValidateToken(App.toString());

@Singleton(AppModuleValidateToken)
export class AppModuleValidate extends BaseModuelValidate {
    getDecorator() {
        return App.toString();
    }
}
