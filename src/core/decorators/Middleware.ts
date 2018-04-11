import { ClassMetadata, IClassDecorator, createClassDecorator } from '@ts-ioc/core';


export const Middleware: IClassDecorator<ClassMetadata> = createClassDecorator<ClassMetadata>('Middleware', null, (metadata) => {
    metadata.singleton = true;
    return metadata;
});
