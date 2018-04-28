import { TypeMetadata, IClassMethodDecorator, createClassMethodDecorator } from '@ts-ioc/core';

/**
 * Model Decorator, definde class as mvc Model.
 *
 * @Model
 */
export const Model: IClassMethodDecorator<TypeMetadata> = createClassMethodDecorator<TypeMetadata>('Model');
