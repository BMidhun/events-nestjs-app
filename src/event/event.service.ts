import { BadRequestException, Injectable } from "@nestjs/common";
import {Repository} from "typeorm"
import {InjectRepository} from "@nestjs/typeorm"
import { EventEntity } from "./entity";
import { IEvent } from "./interface";
import { CreateEventDTO, UpdateEventDTO } from "./dto";
@Injectable()
export class EventService{

    constructor(
        @InjectRepository(EventEntity)
        private eventRepository: Repository<EventEntity>
    ) {

    }

    async getAllEvents():Promise<IEvent[]> {
        const events = await this.eventRepository.find();
        return events;
    }

    async getEvent(id:number):Promise<IEvent> {
        const event = await this.eventRepository.findOneBy({id})
        if(!event)
            throw new BadRequestException("Invalid id")
        return event;
    }

    async createEvent(payload:CreateEventDTO) {
        return await this.eventRepository.save({...payload});
    }

    async updateEvent(id:number, payload:UpdateEventDTO) {
        const event = await this.getEvent(id);
        return await this.eventRepository.save({...event,...payload});
    }

    async deleteEvent(id:number):Promise<IEvent> {
        const event = await this.getEvent(id);
        await this.eventRepository.delete(event);
        return event;
    }

}