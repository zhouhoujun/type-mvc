import { ClassMetadata } from '@ts-ioc/core';

/**
 * model metadata.
 *
 * @export
 * @interface ModelMetadata
 * @extends {ClassMetadata}
 */
export interface ModelMetadata extends ClassMetadata {
    /**
     * model type.
     *
     * @type {string}
     * @memberof ModelMetadata
     */
    modelType?: string;
    /**
     * db table name. default use class name.
     *
     * @type {string}
     * @memberof FieldMetadata
     */
    table?: string;

}
