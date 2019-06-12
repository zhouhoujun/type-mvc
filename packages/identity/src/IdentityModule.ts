import * as vaildates from './vaildates';
import * as middlewares from './middlewares';
import * as passports from './passports';
import { MvcModule } from '@mvx/mvc';


@MvcModule({
    imports: [
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
