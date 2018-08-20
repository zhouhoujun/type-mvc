import { PropertyMetadata } from '@ts-ioc/core';

/**
 * Field metadata.
 *
 * @export
 * @interface FieldMetadata
 * @extends {PropertyMetadata}
 */
export interface FieldMetadata extends PropertyMetadata {
    /**
     * Filed entends Decorator type.
     *
     * @type {string}
     * @memberof FieldMetadata
     */
    fieldType?: string;
    /**
     * db type.
     *
     * @type {string}
     * @memberof FieldMetadata
     */
    dbtype?: string;
    /**
     * db filed name. default use field name.
     *
     * @type {string}
     * @memberof FieldMetadata
     */
    dbfield?: string;

    /**
     * field can required or not.
     *
     * @type {boolean}
     * @memberof FieldMetadata
     */
    required?: boolean;

    /**
     * column db default value.
     *
     * @type {*}
     * @memberof FieldMetadata
     */
    defaultValue?: any;

}
