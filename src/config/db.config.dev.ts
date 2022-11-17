import {registerAs} from "@nestjs/config"
import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { EventEntity, AttendeeEntity } from "src/event/entity"
import { UserEntity } from "src/user/entity"

export default registerAs("DB_DEV_CONFIG", ():TypeOrmModuleOptions => {
    return {
        host:process.env.DB_HOST,
        port:Number(process.env.DB_PORT),
        username:process.env.DB_USER,
        password:process.env.DB_PASSWORD,
        database:process.env.DB_NAME,
        entities:[EventEntity, AttendeeEntity, UserEntity],
        synchronize:true,
        type:"mysql",
    }
})