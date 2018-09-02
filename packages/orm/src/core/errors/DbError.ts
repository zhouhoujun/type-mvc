import { Injectable } from '@ts-ioc/core';


@Injectable
export class DbError extends Error {
    constructor(message: string) {
        super(message);
    }

}
