import { TypeDecorator, makeDecorator, makePropDecorator } from './decoratorFactories';

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
export interface Injectable { }

/**
 * Injectable decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export const Injectable: InjectableDecorator = <InjectableDecorator>makeDecorator('Injectable', []);


/**
 * Type of the Controller decorator / constructor function.
 *
 * @stable
 */
export interface ControllerDecorator extends InjectableDecorator {
    routePrefix?: string;
}

/**
 * Type of the Controller metadata.
 *
 * @stable
 */
export interface Controller { }

/**
 * Controller decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export const Controller: ControllerDecorator = <ControllerDecorator>makeDecorator('Controller', []);



/**
 * Type of the Input decorator / constructor function.
 *
 * @stable
 */
export interface InputDecorator {
    /**
     * Declares a data-bound input property.
     *
     * Angular automatically updates data-bound properties during change detection.
     *
     * `Input` takes an optional parameter that specifies the name
     * used when instantiating a component in the template. When not provided,
     * the name of the decorated property is used.
     *
     * ### Example
     *
     * The following example creates a component with two input properties.
     *
     * ```typescript
     * @Component({
     *   selector: 'bank-account',
     *   template: `
     *     Bank Name: {{bankName}}
     *     Account Id: {{id}}
     *   `
     * })
     * class BankAccount {
     *   @Input() bankName: string;
     *   @Input('account-id') id: string;
     *
     *   // this property is not bound, and won't be automatically updated by Angular
     *   normalizedBankName: string;
     * }
     *
     * @Component({
     *   selector: 'app',
     *   template: `
     *     <bank-account bank-name="RBC" account-id="4747"></bank-account>
     *   `
     * })
     *
     * class App {}
     * ```
     * @stable
     */
    (bindingPropertyName?: string): any;
    new (bindingPropertyName?: string): any;
}

/**
 * Type of the Input metadata.
 *
 * @stable
 */
export interface Input {
    /**
     * Name used when instantiating a component in the template.
     */
    bindingPropertyName?: string;
}

/**
 * Input decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export const Input: InputDecorator = makePropDecorator('Input', [['bindingPropertyName', undefined]]);

/**
 * Type of the Output decorator / constructor function.
 *
 * @stable
 */
export interface OutputDecorator {
    /**
     * Declares an event-bound output property.
     *
     * When an output property emits an event, an event handler attached to that event
     * the template is invoked.
     *
     * `Output` takes an optional parameter that specifies the name
     * used when instantiating a component in the template. When not provided,
     * the name of the decorated property is used.
     *
     * ### Example
     *
     * ```typescript
     * @Directive({
     *   selector: 'interval-dir',
     * })
     * class IntervalDir {
     *   @Output() everySecond = new EventEmitter();
     *   @Output('everyFiveSeconds') five5Secs = new EventEmitter();
     *
     *   constructor() {
     *     setInterval(() => this.everySecond.emit("event"), 1000);
     *     setInterval(() => this.five5Secs.emit("event"), 5000);
     *   }
     * }
     *
     * @Component({
     *   selector: 'app',
     *   template: `
     *     <interval-dir (everySecond)="everySecond()" (everyFiveSeconds)="everyFiveSeconds()">
     *     </interval-dir>
     *   `
     * })
     * class App {
     *   everySecond() { console.log('second'); }
     *   everyFiveSeconds() { console.log('five seconds'); }
     * }
     * ```
     * @stable
     */
    (bindingPropertyName?: string): any;
    new (bindingPropertyName?: string): any;
}

/**
 * Type of the Output metadata.
 *
 * @stable
 */
export interface Output { bindingPropertyName?: string; }

/**
 * Output decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export const Output: OutputDecorator = makePropDecorator('Output', [['bindingPropertyName', undefined]]);