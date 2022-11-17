import { EventEntity } from "src/event/entity";
import {Entity, PrimaryGeneratedColumn,Column, OneToMany} from "typeorm";

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

    @OneToMany(() => EventEntity, (event) => event.organizer)
    events: EventEntity[]

}