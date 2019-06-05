import { Singleton } from '@tsdi/ioc';
import { KoaPassport } from 'koa-passport';

@Singleton
export class MvcPassport extends KoaPassport {
    constructor() {
        super();
    }
}
