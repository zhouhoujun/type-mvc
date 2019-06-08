import { RegFor, DIModule } from '@tsdi/boot';
import * as controllers from './controllers';
import * as vaildates from './vaildates';
import * as middlewares from './middlewares';
import * as passports from './passports';


@DIModule({
    regFor: RegFor.boot,
    imports: [
        passports,
        vaildates,
        controllers,
        middlewares
    ],
    exports: [
        passports,
        vaildates,
        controllers,
        middlewares
    ]
})
export class OAuthModule {

}
