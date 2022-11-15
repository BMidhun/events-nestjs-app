import { EventEntity } from "src/event/entity";
import {PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Entity} from "typeorm"

export enum AttendeeAnswerEnum  {
    Accepted = 1,
    Maybe,
    Rejected
}

@Entity("attendees")
export class AttendeeEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @ManyToOne(() => EventEntity, (event) => event.attendees, {nullable:false, onDelete:"CASCADE"}) // Setting the foreign key eventId as non-nullable since attendees cannot exist without an Event. OnDelete:"CASCADE" will automatically remove entries from attendees when an event is deleted.
    // @JoinColumn({referencedColumnName:"id", name:"event_id"}) // This is optional, by default @ManyToOne decorator sets the foreign key attribute. In this case the name of the attribute will be eventId. But if you want to customize it then use @JoinColumn
    event:EventEntity;

    @Column("enum",{
        enumName:"AttendeeAnswerEnum",
        enum:AttendeeAnswerEnum,
        default:AttendeeAnswerEnum.Accepted
    })
    answer: AttendeeAnswerEnum
}