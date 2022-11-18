import { NotFoundException, Injectable } from "@nestjs/common";
import {Repository, SelectQueryBuilder, DeleteResult} from "typeorm"
import {InjectRepository} from "@nestjs/typeorm"
import { EventEntity, AttendeeEntity, AttendeeAnswerEnum } from "./entity";
import { CreateEventDTO, GetAllEventsDTO, UpdateEventDTO, WhenFilterEnum } from "./dto";
import { UserEntity } from "src/user/entity";
@Injectable()
export class EventService{

    constructor(
        @InjectRepository(EventEntity)
        private eventRepository: Repository<EventEntity>,
        @InjectRepository(AttendeeEntity)
        private attendeeRepository: Repository<AttendeeEntity>
    ) {

    }

    private getAllEventsBaseQuery ({skip,orderBy}) {
        return this.eventRepository.createQueryBuilder("e")
        .orderBy("e.createdAt",orderBy)
        .offset(skip)
    }

    private getAttendeesCountBaseQuery<EventEntity>(query:SelectQueryBuilder<EventEntity> ): SelectQueryBuilder<EventEntity>{
        return query.loadRelationCountAndMap("e.attendeesCount","e.attendees")
                    .loadRelationCountAndMap("e.attendeesAcceptedCount", "e.attendees","attendeesAccepted",(qb) => qb.where("answer = :answer",{answer:AttendeeAnswerEnum.Accepted}))
                    .loadRelationCountAndMap("e.attendeesRejectedCount", "e.attendees","attendeesRejected",(qb) => qb.where("answer = :answer",{answer:AttendeeAnswerEnum.Rejected}))
                    .loadRelationCountAndMap("e.attendeesMaybeCount", "e.attendees","attendeesMaybe",(qb) => qb.where("answer = :answer",{answer:AttendeeAnswerEnum.Maybe}))

    }
    
    private getEventsOnWhenFilterCondition(type:WhenFilterEnum, query:GetAllEventsDTO) {
        const condition = {
            [WhenFilterEnum.TODAY] : "e.when >= CURDATE() AND e.when < CURDATE() + INTERVAL 1 DAY",
            [WhenFilterEnum.TOMORROW] : "e.when >= CURDATE() + INTERVAL 1 DAY AND e.when < CURDATE() + INTERVAL 2 DAY",
            [WhenFilterEnum.THIS_WEEK] : "YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)",
            [WhenFilterEnum.NEXT_WEEK] : "e.when >= CURDATE() + INTERVAL 7 DAY AND  e.when <= CURDATE() + INTERVAL 14 DAY",
            [WhenFilterEnum.NEXT_MONTH] : "YEAR(e.when) = YEAR(CURDATE()) AND MONTH(e.when) = MONTH(CURDATE())"
        }


        
        return this.getAllEventsBaseQuery(query).where(condition[type] + "\t" + " AND (e.name LIKE :value OR e.description LIKE :value)", {value:`%${query.search}%`});
    }

    async getAllEvents(query:GetAllEventsDTO):Promise<EventEntity[]> {
       
        const {limit,search, whenFilter} = query;

        let res: SelectQueryBuilder<EventEntity>;

        if(!whenFilter)
            res = this.getAllEventsBaseQuery(query).where("e.name LIKE :value OR e.description LIKE :value",{value:`%${search}%`})
            .limit(limit);

        else
            res = this.getEventsOnWhenFilterCondition(whenFilter,query);
    
        // const result = (await (res.limit(limit).innerJoinAndSelect("e.attendees", "attendees").where("e.id = attendees.eventId").getMany()))

        // console.log(JSON.stringify(result))
        
        
        return (await this.getAttendeesCountBaseQuery(res.limit(limit)).getMany());

        // const events = await this.eventRepository.find({take:limit, skip, order:{createdAt:orderBy}, where:[{name:ILike(`%${search}%`)}, {description:ILike(`%${search}%`)}] });

        // return events;
    }

    async getEvent(id:number):Promise<EventEntity> {
        // const event = await this.eventRepository.findOne({where:{id}, loadEagerRelations:false}) // loadEagerRelations prevents the attendees entity appearing in the result of the select query.
        // const event = await this.eventRepository.findOne({where:{id}});

        // const res =  this.eventRepository.createQueryBuilder("e").loadRelationCountAndMap("e.attendeesCount", "e.attendees").andWhere("e.id = :id",{id})

        // console.log(await res.getOne()); // The loadRelationCountAndMap method maps the property attendeesCount of EventEntity and the event attendees relation and displays the count of relation.

        const res = this.eventRepository.createQueryBuilder("e").where("id = :id",{id});

        const event = await this.getAttendeesCountBaseQuery(res).getOne();


         if(!event)
            throw new NotFoundException("Event not found")
        return event;
        
        // const event = await this.eventRepository.findOne({where:{id}, relations:["attendees"]});  // we can specify the entiities we want to project in our select query result using relations options array. Pass the enitities name in the array.


        // if(!event)
        //     throw new NotFoundException("Invalid id")
        // return event;
    }

    async getEventsOrganizedByUser(organizerId:number) {
        return await this.getAttendeesCountBaseQuery(this.getAllEventsBaseQuery({skip:0, orderBy:"ASC"}))
        .innerJoinAndSelect("e.organizer","organizer")
        .where("e.organizerId = :id",{id:organizerId}).getMany();
    }

    async getEventAttendees(eventId:number) {
        return await this.attendeeRepository.createQueryBuilder("a")
                          .innerJoinAndSelect("a.user","user","a.userId = user.id")
                         .where("a.eventId = :eventId",{eventId})
                         .getMany();
    }


    async getEventsAttendedByUserId(userId:number) {
        return await this.getAllEventsBaseQuery({skip:0,orderBy:"DESC"})
                        .innerJoinAndSelect("e.attendees","attendees","e.id = attendees.eventId")
                        .where("attendees.userId = :userId",{userId})
                        .getMany();
    } 

    async getEventAttendedByUserId(eventId:number, userId:number) {
        return await this.getAllEventsBaseQuery({skip:0, orderBy:"DESC"})
                        .innerJoinAndSelect("e.attendees","attendees",`e.id = ${eventId}`)
                        .select("e.attendees.")
                        .where("attendees.userId = :userId",{userId})
                        .getOne();
    }  

    async createEvent(payload:CreateEventDTO, user:UserEntity):Promise<EventEntity>  {
         const event = new EventEntity({...payload,organizer:user});
         return await this.eventRepository.save(event);
    }

    async updateEvent(id:number, payload:UpdateEventDTO):Promise<EventEntity>  {
        const event = await this.getEvent(id);

        const updatedEvent = new EventEntity({...event, ...payload})

        const res = await this.eventRepository.save(updatedEvent);
        return res;
    }

    async deleteEvent(id:number):Promise<DeleteResult> {

        // SQL operation using the TypeOrm OOP method can cost performance. Since the deletion process involves both retrieval and deletion which is a two step process can cause performance drop when the number of records to delete increase.
        // const event = await this.getEvent(id);
        // await this.eventRepository.remove(event);
        // return event;

        const res = await this.eventRepository.createQueryBuilder("e").delete().where("id = :id",{id}).execute();

        if(res.affected !== 1)
            throw new NotFoundException("Event doesn't exist");

        return res;

    }


    async createOrUpdateAttendee (userInput:AttendeeAnswerEnum ,eventId:number, userId:number){
        const attendeeEntry = await this.attendeeRepository.findOne({where:{eventId, userId}});
    
        let record = attendeeEntry ? attendeeEntry : new AttendeeEntity();

        record.answer = userInput;
        record.eventId = eventId;
        record.userId = userId;
    
        return this.attendeeRepository.save(record);
    }

}