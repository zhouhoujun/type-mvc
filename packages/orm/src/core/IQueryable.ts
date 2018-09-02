import { Observable } from 'rxjs';

/**
 * Queryable interface.
 *
 * @export
 * @interface IQueryable
 * @extends {Observable<TEntity[]>}
 * @template TEntity
 */
export interface IQueryable<TEntity> {
    /**
     * query dbset.
     *
     * @returns {Observable<TEntity[]>}
     * @memberof IQueryable
     */
    query(): Observable<TEntity[]>;
}
