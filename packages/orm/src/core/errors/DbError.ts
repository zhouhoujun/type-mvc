import { Injectable } from '@tsdi/core';


@Injectable
export class DbError extends Error {
    constructor(message: string) {
        super(message);
    }

}
