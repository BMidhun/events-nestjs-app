import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, ValidationPipe, Query, SerializeOptions, UseGuards, UseInterceptors, ClassSerializerInterceptor, HttpCode } from "@nestjs/common";
import { CurrentUser } from "src/user/current-user.decorator";
import { UserEntity } from "src/user/entity";
import { JwtAuthGuard } from "src/user/guards/jwt-auth.guard";
import { CreateEventDTO, GetAllEventsDTO, UpdateEventDTO } from "./dto";
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
    @Post()
    async createEvent(@Body(new ValidationPipe({whitelist:true,transform:true})) payload:CreateEventDTO, @CurrentUser() user: UserEntity) {
        return await this.eventService.createEvent(payload,user);
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