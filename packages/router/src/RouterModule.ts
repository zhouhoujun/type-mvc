import { DIModule } from '@ts-ioc/bootstrap';
import { RouteBuilder } from './route';
import { Router, CorsMiddleware } from './middlewares';

@DIModule({
    imports: [
        RouteBuilder,
        CorsMiddleware,
        Router
    ],
    exports: [
        RouteBuilder,
        CorsMiddleware,
        Router
    ]
})
export class RouterModule {
}
