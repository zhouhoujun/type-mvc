import { IQueryable } from './IQueryable';
import { Observable } from 'rxjs/Observable';


/**
 * Dbset interface.
 *
 * @export
 * @interface IDbSet
 * @extends {IQueryable<TEntity>}
 * @template TEntity
 */
export interface IDbSet<TEntity> extends IQueryable<TEntity> {
    add(entity: TEntity): Observable<TEntity>;
    update(entity: TEntity): Observable<TEntity>;
    save(entity: TEntity): Observable<TEntity>;
    remove(entity: TEntity): Observable<TEntity>;
    clear(): Observable<TEntity[]>;
}
