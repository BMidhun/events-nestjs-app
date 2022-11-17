import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import {TypeOrmModule} from "@nestjs/typeorm"
import { EventEntity, AttendeeEntity } from "./entity";
@Module({
    imports:[TypeOrmModule.forFeature([EventEntity, AttendeeEntity])],
    controllers:[EventController],
    providers:[EventService]
})

export class EventModule {

}