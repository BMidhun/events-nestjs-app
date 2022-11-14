import {PrimaryGeneratedColumn, Entity, Column} from "typeorm"

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
    createdAt:Date

}