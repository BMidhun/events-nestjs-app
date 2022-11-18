import { EventEntity } from "src/event/entity";
import { UserEntity } from "src/user/entity";
import {PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Entity} from "typeorm"
import {Expose} from "class-transformer"; 

export enum AttendeeAnswerEnum  {
    Accepted = 1,
    Maybe,
    Rejected
}

@Entity("attendees")
export class AttendeeEntity {
    
    @PrimaryGeneratedColumn()
    @Expose()
    id: number;

    @ManyToOne(() => EventEntity, (event) => event.attendees, {nullable:false, onDelete:"CASCADE"}) // Setting the foreign key eventId as non-nullable since attendees cannot exist without an Event. OnDelete:"CASCADE" will automatically remove entries from attendees when an event is deleted.
    // @JoinColumn({referencedColumnName:"id", name:"event_id"}) // This is optional, by default @ManyToOne decorator sets the foreign key attribute. In this case the name of the attribute will be eventId. But if you want to customize it then use @JoinColumn
    @Expose()
    event:EventEntity;

    @Column()
    @Expose()
    eventId:number // This will map the eventId to the id in the events table

    @Column("enum",{
        enumName:"AttendeeAnswerEnum",
        enum:AttendeeAnswerEnum,
        default:AttendeeAnswerEnum.Accepted
    })
    @Expose()
    answer: AttendeeAnswerEnum

    @ManyToOne(() => UserEntity, (user) => user.attended)
    @Expose()
    user: UserEntity

    @Column()
    @Expose()
    userId:number;
}