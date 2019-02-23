import { DIModule } from '@ts-ioc/bootstrap';
import { ModelModule } from '@mvx/model';

@DIModule({
    imports: [
        ModelModule,
    ],
    exports: [
        ModelModule
    ]
})
export class ORMModule {

}
