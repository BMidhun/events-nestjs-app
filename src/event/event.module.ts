import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import {TypeOrmModule} from "@nestjs/typeorm"
import { EventEntity } from "./entity";
import { AttendeeEntity } from "src/attendee/entity/attendee.entity";
@Module({
    imports:[TypeOrmModule.forFeature([EventEntity, AttendeeEntity])],
    controllers:[EventController],
    providers:[EventService]
})

export class EventModule {

}