import { PrimaryColumn, Entity, Column } from 'typeorm';

@Entity()
export class OAuthClient {

    @PrimaryColumn()
    clientId: string;

    @Column()
    clientSecret: string;

    @Column()
    redirectUris: string[]
}
