import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, ValidationPipe, Query, SerializeOptions, UseGuards, UseInterceptors, ClassSerializerInterceptor, HttpCode, Put } from "@nestjs/common";
import { CurrentUser } from "src/user/current-user.decorator";
import { UserEntity } from "src/user/entity";
import { JwtAuthGuard } from "src/user/guards/jwt-auth.guard";
import { AttendeeStatusDTO, CreateEventDTO, GetAllEventsDTO, UpdateEventDTO } from "./dto";
import { EventService } from "./event.service";
import { OwnEventGuard } from "./guards";

@Controller("event")
@SerializeOptions({strategy:"excludeAll"}) // This decorator will prevent all the data in the resulting json of each API from being exposed.
@UseInterceptors(ClassSerializerInterceptor)
export class EventController {

    // private readonly logger = new Logger();

    constructor(private eventService:EventService) {}

    // Most specific route should come before the least specific to avoid conflict. Both route event/all and event/:id looks the same.
    
    @Get("all")
    async getAllEvents(@Query(new ValidationPipe({whitelist:true,transform:true})) query:GetAllEventsDTO) {
        // this.logger.debug("Reached") 
        return await this.eventService.getAllEvents(query);
    }

    @Get(":id")
    async getEventById (@Param("id", ParseIntPipe) id:number) {
        return await this.eventService.getEvent(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/organizer/:organizerId")
    async getEventsOrganizedByUser(
        @Param('organizerId') organizerId:number
    ) { 
        return await this.eventService.getEventsOrganizedByUser(organizerId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id/attendees")
    async getEventAttendees(
        @Param("id", ParseIntPipe) eventId: number
    ){
            return await this.eventService.getEventAttendees(eventId);
    }

    @UseGuards(JwtAuthGuard)
    @Get("attended-by-user")
    async getEventsAttendedByUser(@CurrentUser() user:UserEntity) {
        return await this.eventService.getEventsAttendedByUserId(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id/attended-by-user")
    async getEventAttendedByUser(
        @Param("id", ParseIntPipe) id: number, 
        @CurrentUser() user:UserEntity
        ) {
        return await this.eventService.getEventAttendedByUserId(id,user.id);
    }


    @UseGuards(JwtAuthGuard)
    @Post()
    async createEvent(@Body(new ValidationPipe({whitelist:true,transform:true})) payload:CreateEventDTO, @CurrentUser() user: UserEntity) {
        return await this.eventService.createEvent(payload,user);
    }

    @UseGuards(JwtAuthGuard)
    @Put(":id/attendee-create-update")
    async createOrUpdateAttendee(
        @Body(new ValidationPipe({whitelist:true})) userInput: AttendeeStatusDTO,
        @Param("id", ParseIntPipe) id: number,
        @CurrentUser() user: UserEntity
    ) {
        return await this.eventService.createOrUpdateAttendee(userInput.answer,id,user.id)
    }

    @UseGuards(JwtAuthGuard, OwnEventGuard)
    @Patch(":id")
    async updateEvent(@Param("id", ParseIntPipe) id:number, @Body(new ValidationPipe({whitelist:true,transform:true})) payload: UpdateEventDTO) {
        return await this.eventService.updateEvent(id,payload);
    }

    @UseGuards(JwtAuthGuard, OwnEventGuard)
    @Delete(":id")
    @HttpCode(204)
    async deleteEvent(@Param("id", ParseIntPipe) id:number) {
        return await this.eventService.deleteEvent(id);
    }
}