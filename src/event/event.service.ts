import { NotFoundException, Injectable } from "@nestjs/common";
import {Repository, ILike, SelectQueryBuilder,} from "typeorm"
import {InjectRepository} from "@nestjs/typeorm"
import { EventEntity } from "./entity";
import { CreateEventDTO, GetAllEventsDTO, UpdateEventDTO, WhenFilterEnum } from "./dto";
import { AttendeeAnswerEnum } from "src/attendee/entity/attendee.entity";
@Injectable()
export class EventService{

    constructor(
        @InjectRepository(EventEntity)
        private eventRepository: Repository<EventEntity>
    ) {

    }

    private getAllEventsBaseQuery ({skip,orderBy}) {
        return this.eventRepository.createQueryBuilder("e")
        .orderBy("e.createdAt",orderBy)
        .skip(skip)
    }
    
    private getEventsOnWhenFilterCondition(type:WhenFilterEnum, query:GetAllEventsDTO) {
        const condition = {
            [WhenFilterEnum.TODAY] : "e.when >= CURDATE() AND e.when < CURDATE() + INTERVAL 1 DAY",
            [WhenFilterEnum.TOMORROW] : "e.when >= CURDATE() + INTERVAL 1 DAY AND e.when < CURDATE() + INTERVAL 2 DAY",
            [WhenFilterEnum.THIS_WEEK] : "YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)",
            [WhenFilterEnum.NEXT_WEEK] : "e.when >= CURDATE() + INTERVAL 7 DAY AND  e.when <= CURDATE() + INTERVAL 14 DAY",
            [WhenFilterEnum.NEXT_MONTH] : "YEAR(e.when) = YEAR(CURDATE()) AND MONTH(e.when) = MONTH(CURDATE())"
        }

        console.log("Reached", condition[type])

        
        return this.getAllEventsBaseQuery(query).where(condition[type] + "\t" + " AND (e.name LIKE :value OR e.description LIKE :value)", {value:`%${query.search}%`});
    }

    async getAllEvents(query:GetAllEventsDTO):Promise<EventEntity[]> {
       
        const {limit,skip,search,orderBy, whenFilter} = query;

        let res: SelectQueryBuilder<EventEntity>;

        if(!whenFilter)
            res = this.getAllEventsBaseQuery(query).where("e.name LIKE :value OR e.description LIKE :value",{value:`%${search}%`})
            .limit(limit);

        else
            res = this.getEventsOnWhenFilterCondition(whenFilter,query);
    
        
        console.log(await res.limit(limit).getMany());

        const events = await this.eventRepository.find({take:limit, skip, order:{createdAt:orderBy}, where:[{name:ILike(`%${search}%`)}, {description:ILike(`%${search}%`)}] });

        return events;
    }

    async getEvent(id:number):Promise<EventEntity> {
        // const event = await this.eventRepository.findOne({where:{id}, loadEagerRelations:false}) // loadEagerRelations prevents the attendees entity appearing in the result of the select query.
        // const event = await this.eventRepository.findOne({where:{id}});

        // const res =  this.eventRepository.createQueryBuilder("e").loadRelationCountAndMap("e.attendeesCount", "e.attendees").andWhere("e.id = :id",{id})

        // console.log(await res.getOne()); // The loadRelationCountAndMap method maps the property attendeesCount of EventEntity and the event attendees relation and displays the count of relation.

        const res = this.eventRepository.createQueryBuilder("e").loadRelationCountAndMap("e.attendeesCount","e.attendees").loadRelationCountAndMap("e.attendeesAcceptedCount","e.attendees","accepted",(qb) => qb.where("answer = :answer",{answer:AttendeeAnswerEnum.Rejected}));

        console.log(await res.getOne());
        
        const event = await this.eventRepository.findOne({where:{id}, relations:["attendees"]});  // we can specify the entiities we want to project in our select query result using relations options array. Pass the enitities name in the array.


        if(!event)
            throw new NotFoundException("Invalid id")
        return event;
    }

    async createEvent(payload:CreateEventDTO):Promise<EventEntity>  {
        return await this.eventRepository.save({...payload});
    }

    async updateEvent(id:number, payload:UpdateEventDTO):Promise<EventEntity>  {
        const event = await this.getEvent(id);
        return await this.eventRepository.save({...event,...payload});
    }

    async deleteEvent(id:number):Promise<EventEntity> {
        const event = await this.getEvent(id);
        await this.eventRepository.remove(event);
        return event;
    }

}