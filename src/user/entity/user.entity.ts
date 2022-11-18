import { EventEntity } from "src/event/entity";
import {Entity, PrimaryGeneratedColumn,Column, OneToMany} from "typeorm";
import {Expose} from "class-transformer"
import { AttendeeEntity } from "src/event/entity";

@Entity("user")
export class UserEntity {

    constructor(partial?: Partial<UserEntity>) {
        Object.assign(this,partial);
    }

    @PrimaryGeneratedColumn()
    @Expose()
    id:number;

    @Column({unique:true})
    @Expose()
    email: string;

    @Column()
    password: string;

    @Column()
    @Expose()
    firstName: string;

    @Column()
    @Expose()
    lastName : string;

    @OneToMany(() => EventEntity, (event) => event.organizer, {onDelete:"CASCADE"})
    events: EventEntity[]

    @OneToMany(() => AttendeeEntity, (attendee) => attendee.userId,{onDelete:"CASCADE"})
    attended:AttendeeEntity[]

}