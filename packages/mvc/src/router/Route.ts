import { MvcMiddleware } from '../middlewares';
import { Input, AfterInit } from '@tsdi/boot';
import { IContext } from '../IContext';

export abstract class Route extends MvcMiddleware implements AfterInit {

    constructor(){
        
    }

    @Input()
    url: string;

    async execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        ctx.url
    }

    canNavigate(ctx: IContext){
       return !ctx.status || ctx.status === 404;
    }

    onAfterInit(): void | Promise<void> {
        let routPath = this.url;
        if (routPath === '/') {
            routPath = '';
        }
        if (/\/\s*$/.test(routPath)) {
            routPath = routPath.substring(0, routPath.lastIndexOf('/'));
        }
        if (/\?\S*$/.test(routPath)) {
            routPath = routPath.substring(0, routPath.lastIndexOf('?'));
        }
        this.url = routPath;
    }
}
