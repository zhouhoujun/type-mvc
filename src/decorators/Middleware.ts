import { ClassMetadata, IClassDecorator, createClassDecorator } from 'type-autofac';


export const Middleware: IClassDecorator<ClassMetadata> = createClassDecorator<ClassMetadata>('Middleware', null, (metadata) => {
    metadata.singleton = true;
    return metadata;
});
