import { AttendeeEntity } from "src/event/entity/attendee.entity";
import { UserEntity } from "src/user/entity";
import {PrimaryGeneratedColumn, Entity, Column, OneToMany, ManyToOne, JoinColumn} from "typeorm"
import {Expose} from "class-transformer"

@Entity("events")
export class EventEntity {

    constructor(partial?: Partial<EventEntity>) {
        Object.assign(this,partial);
    }

    @PrimaryGeneratedColumn({type:"int"})
    @Expose() // This decorator will expose the attribute in the resulting json response of the API it includes.
    id:number;

    @Column({length:200})
    @Expose()
    name:string;

    @Column({length:500})
    @Expose()
    description:string;

    @Column({type:"datetime"})    
    @Expose()
    when:Date;

    @Column()
    @Expose()
    address:string;

    @Column({type:"datetime", default: () => "CURRENT_TIMESTAMP"})
    @Expose()
    createdAt:Date;

    @OneToMany(() => AttendeeEntity, (attendee) => attendee.event, {eager:true}) // If eager is set to true, then while performing find operations on event entity using ORM we will be seeing the attendess list along the result. We can explicitly change this behaviour on the find method
    @Expose()
    attendees: AttendeeEntity[];

    @ManyToOne(() => UserEntity, (user) => user.events)
    organizer: UserEntity;

    @Column({nullable:true})
    organizerId: number;

    // Virtual Cols
    @Expose()
    attendeesCount?:number; // This will be a virtual property in the Entity and will not be visible/saved in the DB.
    @Expose()
    attendeesAcceptedCount?:number;
    @Expose()
    attendeesMayBeCount?:number;
    @Expose()
    attendeesRejectedCount?:number;
}