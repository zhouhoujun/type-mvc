import { TypeMetadata, IClassMethodDecorator, createClassMethodDecorator } from 'tsioc';


export const Model: IClassMethodDecorator<TypeMetadata> = createClassMethodDecorator<TypeMetadata>('Model');
