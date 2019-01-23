import { DIModule } from '@ts-ioc/bootstrap';
import { AopModule } from '@ts-ioc/aop';
import { LogModule } from '@ts-ioc/logs';
import * as injectors from './injectors';
import * as modles from './model';
import { MvcCoreModule } from './CoreModule';
import { MvcConfigureRegister } from './MvcConfigureRegister';
import { Application } from './Application';

@DIModule({
    imports: [
        MvcCoreModule,
        Application,
        MvcConfigureRegister,
        AopModule,
        LogModule,
        injectors,
        modles
    ],
    exports: [
        AopModule,
        LogModule,
        injectors,
        Application,
        MvcConfigureRegister,
        modles
    ]
})
export class MvcModule {

}
