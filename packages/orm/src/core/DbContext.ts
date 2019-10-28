import { Injectable, Type } from '@tsdi/ioc';
import { IContainer, IContainerBuilder } from '@tsdi/core';
import { ModuleBuilder } from '@tsdi/boot';
import { IDbSet } from './IDbSet';
import { IConnection } from './IConnection';
import { DbSet } from './DbSet';

@Injectable
export class DbContext {

    container: IContainer;
    containerBuilder: IContainerBuilder;
    protected log: Type;

    constructor() {
    }

    getDbSet<TEntity>(entityType: Type<TEntity>): DbSet<TEntity> {
        return null;
    }

    getConnection(name: string): IConnection {
        return null;
    }

    protected registerExt(container: IContainer) {
        if (this.log) {
            container.register(this.log);
        }
        container.registerSingleton(DbContext, this);
    }

}
