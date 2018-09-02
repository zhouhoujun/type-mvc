import { IContainer, Type, Injectable, IContainerBuilder } from '@ts-ioc/core';
import { ModuleBuilder } from '@ts-ioc/bootstrap';
import { IDbSet } from './IDbSet';
import { IConnection } from './IConnection';
import { DbSet } from './DbSet';

@Injectable
export class DbContext extends ModuleBuilder<IDbSet<any>> {

    container: IContainer;
    containerBuilder: IContainerBuilder;
    protected log: Type<any>;

    constructor() {
        super();
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
