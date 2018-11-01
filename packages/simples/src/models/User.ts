import { Model, Field } from '@mvx/mvc';


@Model
export class User {
    constructor() {

    }
    @Field
    name: string;
    @Field
    sex: string;
    @Field
    age: number;

    @Field
    names: string[];
}
