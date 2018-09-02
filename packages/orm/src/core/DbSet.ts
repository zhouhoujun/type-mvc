import { IQueryable } from './IQueryable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@ts-ioc/core';
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
        this.adds.next(entity);
    }

    update(entity: TEntity): Observable<TEntity> {
        throw new Error("Method not implemented.");
    }

    save(entity: TEntity): Observable<TEntity> {
        throw new Error("Method not implemented.");
    }

    remove(entity: TEntity): Observable<TEntity> {

    }

    clear(): Observable<TEntity[]> {

    }

    query(): Observable<TEntity[]> {
        throw new Error("Method not implemented.");
    }

}
