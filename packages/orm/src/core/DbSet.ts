import { IQueryable } from './IQueryable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@tsdi/ioc';
import { IDbSet } from './IDbSet';
import { Observable } from 'rxjs/Observable';


@Injectable
export class DbSet<TEntity> implements IDbSet<TEntity>, IQueryable<TEntity> {
    private adds: BehaviorSubject<TEntity[]>;
    private updates: BehaviorSubject<TEntity[]>;
    private removes: BehaviorSubject<TEntity[]>;

    constructor() {

    }

    add(...entity: TEntity[]): Observable<TEntity> {
        throw new Error("Method not implemented.");
    }

    update(entity: TEntity): Observable<TEntity> {
        throw new Error("Method not implemented.");
    }

    save(entity: TEntity): Observable<TEntity> {
        throw new Error("Method not implemented.");
    }

    remove(entity: TEntity): Observable<TEntity> {
        throw new Error("Method not implemented.");
    }

    clear(): Observable<TEntity[]> {
        throw new Error("Method not implemented.");
    }

    query(): Observable<TEntity[]> {
        throw new Error("Method not implemented.");
    }

}
