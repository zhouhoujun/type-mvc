/**
 * model relationship
 *
 * @export
 * @enum {number}
 */
export enum Relationship {
  /**
   * one to many.
   */
  oneToMany = 'oneToMany',
  /**
   * one to one.
   */
  oneToOne = 'oneToOne',
  /**
   * many to many.
   */
  manyToMany = 'manyToMany'
}
