import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, ValidationPipe, Query } from "@nestjs/common";
import { CreateEventDTO, GetAllEventsDTO, UpdateEventDTO } from "./dto";
import { EventService } from "./event.service";

@Controller("event")
export class EventController {

    constructor(private eventService:EventService) {}

    // Most specific route should come before the least specific to avoid conflict. Both route event/all and event/:id looks the same.
    
    @Get("all")
    async getAllEvents(@Query(new ValidationPipe({whitelist:true,transform:true})) query:GetAllEventsDTO) {
        return await this.eventService.getAllEvents(query);
    }

    @Get(":id")
    async getEventById (@Param("id", ParseIntPipe) id:number) {
        return await this.eventService.getEvent(id);
    }

    @Post()
    async createEvent(@Body(new ValidationPipe({whitelist:true,transform:true})) payload:CreateEventDTO) {
        return await this.eventService.createEvent(payload);
    }

    @Patch(":id")
    async updateEvent(@Param("id", ParseIntPipe) id:number, @Body(new ValidationPipe({whitelist:true,transform:true})) payload: UpdateEventDTO) {
        return await this.eventService.updateEvent(id,payload);
    }

    @Delete(":id")
    async deleteEvent(@Param("id", ParseIntPipe) id:number) {
        return await this.eventService.deleteEvent(id);
    }
}