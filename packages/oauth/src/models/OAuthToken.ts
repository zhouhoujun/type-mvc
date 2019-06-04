import { PrimaryColumn, Entity, Column } from 'typeorm';

@Entity()
export class OAuthToken {

    @PrimaryColumn()
    accessToken: string;

    @Column()
    accessTokenExpiresOn: Date;

    @Column()
    clientId: string;

    @Column()
    userId: string;


    @Column()
    refreshToken: string;

    @Column()
    refreshTokenExpiresOn: Date;

}
