import { DIModule } from '@ts-ioc/bootstrap';
import { RouteBuilder } from './route';
import { Router } from './middlewares';

@DIModule({
    imports: [
        RouteBuilder,
        Router
    ],
    exports: [
        RouteBuilder,
        Router
    ]
})
export class RouterModule {
}
