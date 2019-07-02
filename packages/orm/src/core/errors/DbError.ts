import { Injectable } from '@tsdi/ioc';


@Injectable
export class DbError extends Error {
    constructor(message: string) {
        super(message);
    }

}
