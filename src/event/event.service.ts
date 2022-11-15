import { NotFoundException, Injectable } from "@nestjs/common";
import {Repository, ILike,} from "typeorm"
import {InjectRepository} from "@nestjs/typeorm"
import { EventEntity } from "./entity";
import { IEvent } from "./interface";
import { CreateEventDTO, GetAllEventsDTO, UpdateEventDTO } from "./dto";
@Injectable()
export class EventService{

    constructor(
        @InjectRepository(EventEntity)
        private eventRepository: Repository<EventEntity>
    ) {

    }

    async getAllEvents(query:GetAllEventsDTO):Promise<EventEntity[]> {
       
        const {limit,skip,search,orderBy} = query
        
        const events = await this.eventRepository.find({take:limit, skip, order:{createdAt:orderBy}, where:[{name:ILike(`%${search}%`)}, {description:ILike(`%${search}%`)}] });

        return events;
    }

    async getEvent(id:number):Promise<EventEntity> {
        // const event = await this.eventRepository.findOne({where:{id}, loadEagerRelations:false}) // loadEagerRelations prevents the attendees entity appearing in the result of the select query.
        const event = await this.eventRepository.findOne({where:{id}, relations:["attendees"]});  // we can specify the entiities we want to project in our select query result using relations options array. Pass the enitities name in the array.
        // const event = await this.eventRepository.findOne({where:{id}});
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