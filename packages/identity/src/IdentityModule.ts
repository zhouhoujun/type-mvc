import { IocExt, Inject, DecoratorScopes, ActionInjectorToken, DesignRegisterer } from '@tsdi/ioc';
import { ContainerToken, IContainer } from '@tsdi/core';
import { ComponentsModule, ElementModule } from '@tsdi/components';
import { MvcModule, Controller } from '@mvx/mvc';
import * as vaildates from './vaildates';
import * as middlewares from './middlewares';
import * as passports from './passports';
import { ControllerAuthRegisterAction, AuthRoutesToken } from './registers/ControllerAuthRegisterAction';
import { IdentityStartupService } from './IdentityStartupService';
import { DIModule } from '@tsdi/boot';


@IocExt()
class IdentitySetupModule {

    constructor() {

    }

    setup(@Inject(ContainerToken) container: IContainer) {
        container.bindProvider(AuthRoutesToken, new Set());
        let actjtr = container.getInstance(ActionInjectorToken);
        actjtr.register(ControllerAuthRegisterAction);

        let dreger = actjtr.getInstance(DesignRegisterer);
        dreger.register(Controller, DecoratorScopes.Class, ControllerAuthRegisterAction);

    }
}



@DIModule({
    regIn: 'root',
    imports: [
        IdentitySetupModule,
        ComponentsModule,
        ElementModule
    ],
    providers: [
        IdentityStartupService,
        passports,
        vaildates,
        middlewares
    ]
})
export class IdentityModule {

}

