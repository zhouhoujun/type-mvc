import { Type } from '../util';
import { TypeDecorator, makeDecorator, makePropDecorator } from './decorators';

/**
 * Type of the Injectable decorator / constructor function.
 *
 * @stable
 */
export interface InjectableDecorator {
    /**
     * @whatItDoes A marker metadata that marks a class as available to {@link Injector} for creation.
     * @howToUse
     * ```
     * @Injectable()
     * class Car {}
     * ```
     *
     * @description
     * For more details, see the {@linkDocs guide/dependency-injection "Dependency Injection Guide"}.
     *
     * ### Example
     *
     * {@example core/di/ts/metadata_spec.ts region='Injectable'}
     *
     * {@link Injector} will throw {@link NoAnnotationError} when trying to instantiate a class that
     * does not have `@Injectable` marker, as shown in the example below.
     *
     * {@example core/di/ts/metadata_spec.ts region='InjectableThrows'}
     *
     * @stable
     */
    (): any;
    new (): Injectable;
}

/**
 * Type of the Injectable metadata.
 *
 * @stable
 */
export interface Injectable extends Type<any> { }

/**
 * Injectable decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export const Injectable: InjectableDecorator = makeDecorator('Injectable', []) as InjectableDecorator;

