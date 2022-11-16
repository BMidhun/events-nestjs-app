import {Entity, PrimaryGeneratedColumn,Column} from "typeorm";

@Entity("user")
export class UserEntity {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    email: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName : string;

}