import { TypeMetadata, IClassMethodDecorator, createClassMethodDecorator } from 'type-autofac';


export const Authorization: IClassMethodDecorator<TypeMetadata> = createClassMethodDecorator<TypeMetadata>('Authorization');
