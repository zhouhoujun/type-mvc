import { PropertyMetadata, Type } from '@ts-ioc/core';

/**
 * Field metadata.
 *
 * @export
 * @interface FieldMetadata
 * @extends {PropertyMetadata}
 */
export interface FieldMetadata extends PropertyMetadata {
    /**
     * name of Filed decorator entends Decorator type.
     *
     * @type {string}
     * @memberof FieldMetadata
     */
    decorName?: string;

    /**
     * Filed ref model type.
     *
     * @type {string}
     * @memberof FieldMetadata
     */
    refType?: Type<any>;

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
