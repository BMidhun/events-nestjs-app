import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, ValidationPipe } from "@nestjs/common";
import { CreateEventDTO, UpdateEventDTO } from "./dto";

@Controller("event")
export class EventController {

    // Most specific route should come before the least specific to avoid conflict. Both route event/all and event/:id looks the same.
    
    @Get("all")
    async getAllEvents() {
        return "Hello"
    }

    @Get(":id")
    async getEventById (@Param("id", ParseIntPipe) id:number) {
        return id;
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