import { TypeMetadata, IClassMethodDecorator, createClassMethodDecorator } from 'tsioc';


export const Authorization: IClassMethodDecorator<TypeMetadata> = createClassMethodDecorator<TypeMetadata>('Authorization');
