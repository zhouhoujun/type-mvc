import { Injectable } from '@tsdi/ioc';
import { DbError } from './DbError';


@Injectable
export class ConnectError extends DbError {
    constructor(message = 'database connected failed.') {
        super(message);
    }
}
