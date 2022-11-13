import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, ValidationPipe } from "@nestjs/common";
import { CreateEventDTO, UpdateEventDTO } from "./dto";

@Controller("event")

export class EventController {

    @Get("all")

    async getAllEvents() {

    }

    @Get(":id")

    async getEventById (@Param("id", ParseIntPipe) id:number) {

    }

    @Post()
    
    async createEvent(@Body(new ValidationPipe({whitelist:true,transform:true})) payload:CreateEventDTO) {

    }

    @Patch(":id")

    async updateEvent(@Param("id", ParseIntPipe) id:number, @Body(new ValidationPipe({whitelist:true,transform:true})) payload: UpdateEventDTO) {

    }

    @Delete(":id")

    async deleteEvent(@Param("id", ParseIntPipe) id:number) {
        
    }
}