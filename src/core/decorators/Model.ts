import { TypeMetadata, IClassMethodDecorator, createClassMethodDecorator } from '@ts-ioc/core';


export const Model: IClassMethodDecorator<TypeMetadata> = createClassMethodDecorator<TypeMetadata>('Model');
