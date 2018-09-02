import { FieldMetadata } from './FieldMetadata';

/**
 * max length metadata.
 *
 * @export
 * @interface MinLengthMetadata
 * @extends {FieldMetadata}
 */
export interface MinLengthMetadata extends FieldMetadata {
    /**
     * min length
     *
     * @type {number}
     * @memberof MinLengthMetadata
     */
    minLength?: number;
    /**
     * error message.
     *
     * @type {string}
     * @memberof MinLengthMetadata
     */
    errorMsg?: string;
}
