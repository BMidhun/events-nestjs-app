import { AttendeeEntity } from "src/attendee/entity/attendee.entity";
import { UserEntity } from "src/user/entity";
import {PrimaryGeneratedColumn, Entity, Column, OneToMany, ManyToOne, JoinColumn} from "typeorm"

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

    @ManyToOne(() => UserEntity, (user) => user.events)
    organizer: UserEntity;

    @Column({nullable:true})
    organizerId: number;

    // Virtual Cols
    attendeesCount?:number; // This will be a virtual property in the Entity and will not be visible/saved in the DB.
    attendeesAcceptedCount?:number;
    attendeesMayBeCount?:number;
    attendeesRejectedCount?:number;
}