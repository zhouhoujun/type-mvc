import { TypeMetadata, IClassMethodDecorator, createClassMethodDecorator, ClassMethodDecorator, isClassMetadata, Express, isString, isFunction } from 'tsioc';


export interface LoggerMetadata extends TypeMetadata {
    logname?: string;
    express?: Express<any, boolean>
}
export interface ILoggerMetadata<T extends LoggerMetadata> extends IClassMethodDecorator<T> {
    (logname?: string, express?: Express<any, boolean>): ClassMethodDecorator;
}

export const Logger: ILoggerMetadata<LoggerMetadata> = createClassMethodDecorator<TypeMetadata>('Logger',
    adapter => {
        adapter.next<LoggerMetadata>({
            isMetadata: (arg) => isClassMetadata(arg, ['logname']),
            match: (arg) => isString(arg),
            setMetadata: (metadata, arg) => {
                metadata.logname = arg;
            }
        });
        adapter.next<LoggerMetadata>({
            match: (arg) => isFunction(arg),
            setMetadata: (metadata, arg) => {
                metadata.express = arg;
            }
        });
    }) as ILoggerMetadata<LoggerMetadata>;
