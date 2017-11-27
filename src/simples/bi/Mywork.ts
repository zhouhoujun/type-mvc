import { Injectable } from 'type-autofac';


@Injectable
export class Mywork {

    workA() {
        return 'doing work A';
    }

    workB() {
        return 'doing work B';
    }
}
