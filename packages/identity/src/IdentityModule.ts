import * as vaildates from './vaildates';
import * as middlewares from './middlewares';
import * as passports from './passports';
import { MvcModule, Controller } from '@mvx/mvc';
import { ComponentsModule, ElementModule } from '@tsdi/components';
import { IocExt, ContainerToken, IContainer } from '@tsdi/core';
import { Inject, DesignDecoratorRegisterer, DecoratorScopes } from '@tsdi/ioc';
import { ControllerAuthRegisterAction, AuthRoutesToken } from './registers/ControllerAuthRegisterAction';
import { IdentityStartupService } from './IdentityStartupService';


@IocExt('setup')
class IdentitySetupModule {

    constructor() {

    }

    setup(@Inject(ContainerToken) container: IContainer) {

        container.bindProvider(AuthRoutesToken, new Set());

        container.getActionRegisterer()
            .register(container, ControllerAuthRegisterAction);

        let dreger = container.get(DesignDecoratorRegisterer);
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

