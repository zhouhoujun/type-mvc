import * as vaildates from './vaildates';
import * as middlewares from './middlewares';
import * as passports from './passports';
import { MvcModule } from '@mvx/mvc';
import { ComponentsModule, ElementModule } from '@tsdi/components';


@MvcModule({
    imports: [
        ComponentsModule,
        ElementModule,
        passports,
        vaildates,
        middlewares
    ],
    exports: [
        passports,
        vaildates,
        middlewares
    ]
})
export class IdentityModule {

}
