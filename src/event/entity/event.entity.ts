import { AttendeeEntity } from "src/attendee/entity/attendee.entity";
import {PrimaryGeneratedColumn, Entity, Column, OneToMany} from "typeorm"

@Entity("events")
export class EventEntity {

    @PrimaryGeneratedColumn({type:"int"})
    id:number;

    @Column({length:200})
    name:string;

    @Column({length:500})
    description:string;

    @Column({type:"datetime"})    
    when:Date;

    @Column()
    address:string;

    @Column({type:"datetime", default: () => "CURRENT_TIMESTAMP"})
    createdAt:Date;

    @OneToMany(() => AttendeeEntity, (attendee) => attendee.event, {eager:true}) // If eager is set to true, then while performing find operations on event entity using ORM we will be seeing the attendess list along the result. We can explicitly change this behaviour on the find method
    attendees: AttendeeEntity[];
}