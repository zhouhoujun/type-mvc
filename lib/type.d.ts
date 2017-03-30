export declare const Type: FunctionConstructor;
export declare function isType(v: any): v is Type<any>;
export interface Type<T> extends Function {
    new (...args: any[]): T;
}
