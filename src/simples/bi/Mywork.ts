import { Injectable } from '@ts-ioc/core';


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
    save(user: any) {
        return user;
    }
}
