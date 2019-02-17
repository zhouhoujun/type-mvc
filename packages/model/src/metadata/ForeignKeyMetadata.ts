import { FieldMetadata } from './FieldMetadata';

/**
 * foreign key metadata.
 *
 * @export
 * @interface ForeignKeyMetadata
 * @extends {FieldMetadata}
 */
export interface ForeignKeyMetadata extends FieldMetadata {
        /**
     * Foreign Key
     *
     * @type {string}
     * @memberof FieldMetadata
     */
    foreignKey?: string;

    /**
     * foreign order.
     *
     * @type {number}
     * @memberof ForeignKeyMetadata
     */
    foreignOrder?: number;
}
