import { App } from '../decorators';
import { Application } from '../Application';
import { Injectable, MetaAccessor, InjectMetaAccessorToken } from '@ts-ioc/core';

export const AppMetaAccessorToken = new InjectMetaAccessorToken(Application);

@Injectable(AppMetaAccessorToken)
export class AppMetaAccessor extends MetaAccessor {
    constructor() {
        super(App.toString())
    }
}
