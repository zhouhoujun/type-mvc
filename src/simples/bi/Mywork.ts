import { Injectable } from 'tsioc';


@Injectable
export class Mywork {

    workA() {
        return 'doing work A';
    }

    workB() {
        return 'doing work B';
    }

    find(name: string) {
        return {
            name: name,
            sex: 'man',
            age: 10000
        }
    }
}
