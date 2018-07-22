import { ClassMetadata, IClassDecorator, createClassDecorator } from '@ts-ioc/core';

/**
 * Middleware Decorator, definde class as mvc middleware.
 *
 * @Middleware
 */
export const Middleware: IClassDecorator<ClassMetadata> = createClassDecorator<ClassMetadata>('Middleware', null, (metadata) => {
    metadata.singleton = true;
    return metadata;
});
