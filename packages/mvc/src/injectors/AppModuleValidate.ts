import { InjectModuleValidateToken, Singleton, ModuelValidate } from '@ts-ioc/core';
import { App } from '../decorators';


export const AppModuleValidateToken = new InjectModuleValidateToken(App.toString());

@Singleton(AppModuleValidateToken)
export class AppModuleValidate extends ModuelValidate {
    getDecorator() {
        return App.toString();
    }
}
