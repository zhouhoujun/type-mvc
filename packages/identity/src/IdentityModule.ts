import { Inject, DesignDecoratorRegisterer, DecoratorScopes, ActionRegisterer } from '@tsdi/ioc';
import { IocExt, ContainerToken, IContainer } from '@tsdi/core';
import { ComponentsModule, ElementModule } from '@tsdi/components';
import { MvcModule, Controller } from '@mvx/mvc';
import * as vaildates from './vaildates';
import * as middlewares from './middlewares';
import * as passports from './passports';
import { ControllerAuthRegisterAction, AuthRoutesToken } from './registers/ControllerAuthRegisterAction';
import { IdentityStartupService } from './IdentityStartupService';


@IocExt('setup')
class IdentitySetupModule {

    constructor() {

    }

    setup(@Inject(ContainerToken) container: IContainer) {

        container.bindProvider(AuthRoutesToken, new Set());

        container.getInstance(ActionRegisterer)
            .register(container, ControllerAuthRegisterAction);

        let dreger = container.getInstance(DesignDecoratorRegisterer);
        dreger.register(Controller, DecoratorScopes.Class, ControllerAuthRegisterAction);

    }
}



@MvcModule({
    imports: [
        IdentitySetupModule,
        IdentityStartupService,
        ComponentsModule,
        ElementModule,
        passports,
        vaildates,
        middlewares
    ],
    exports: [
        passports,
        vaildates,
        middlewares,
        IdentityStartupService
    ]
})
export class IdentityModule {

}

