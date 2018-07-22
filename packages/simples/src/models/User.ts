import { Model, Field } from '../../index';


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
}
