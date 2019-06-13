import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('User')
export class User {

    @PrimaryColumn({default: ''})
    email: string;

    @PrimaryColumn()
    username: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    password: string;
}
