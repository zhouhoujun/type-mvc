import { FieldMetadata } from './FieldMetadata';

/**
 * max length metadata.
 *
 * @export
 * @interface MaxLengthMetadata
 * @extends {FieldMetadata}
 */
export interface MaxLengthMetadata extends FieldMetadata {
    /**
     * max length
     *
     * @type {number}
     * @memberof MaxLengthMetadata
     */
    maxLength?: number;
    /**
     * err message.
     *
     * @type {string}
     * @memberof MaxLengthMetadata
     */
    errorMsg?: string;
}
