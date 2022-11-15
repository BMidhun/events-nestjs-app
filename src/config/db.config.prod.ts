import {registerAs} from "@nestjs/config"
import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { AttendeeEntity } from "src/attendee/entity/attendee.entity"
import { EventEntity } from "src/event/entity"

export default registerAs("DB_PROD_CONFIG", ():TypeOrmModuleOptions => {
    return {
        host:process.env.DB_HOST,
        port:Number(process.env.DB_PORT),
        username:process.env.DB_USER,
        password:process.env.DB_PASSWORD,
        database:process.env.DB_NAME,
        entities:[EventEntity,AttendeeEntity],
        synchronize:false,
        type:"mysql",
    }
})