import { DIModule } from '@ts-ioc/bootstrap';
import { AopModule } from '@ts-ioc/aop';
import { LogModule } from '@ts-ioc/logs';
import * as injectors from './injectors';
import * as modles from './model';
import { MvcCoreModule } from './CoreModule';

@DIModule({
    imports: [
        MvcCoreModule,
        AopModule,
        LogModule,
        injectors,
        modles
    ],
    exports: [
        AopModule,
        LogModule,
        injectors,
        modles
    ]
})
export class MvcModule {

}
