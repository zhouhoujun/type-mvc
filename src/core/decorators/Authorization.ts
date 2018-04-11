import { TypeMetadata, IClassMethodDecorator, createClassMethodDecorator, ClassMethodDecorator, isClassMetadata, isString } from '@ts-ioc/core';


export interface AuthorizationMetadata extends TypeMetadata {
    role?: string;
}
export interface IAuthorizationDecorator<T extends AuthorizationMetadata> extends IClassMethodDecorator<T> {
    (role?: string): ClassMethodDecorator;
}

export const Authorization: IAuthorizationDecorator<AuthorizationMetadata> = createClassMethodDecorator<AuthorizationMetadata>('Authorization',
    adapter => {
        adapter.next<AuthorizationMetadata>({
            isMetadata: (arg) => isClassMetadata(arg, ['role']),
            match: (arg) => isString(arg),
            setMetadata: (metadata, arg) => {
                metadata.role = arg;
            }
        });
    }) as IAuthorizationDecorator<AuthorizationMetadata>;
