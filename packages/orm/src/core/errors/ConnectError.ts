import { Injectable } from '@ts-ioc/core';
import { DbError } from './DbError';


@Injectable
export class ConnectError extends DbError {
    constructor(message = 'database connected failed.') {
        super(message);
    }
}
