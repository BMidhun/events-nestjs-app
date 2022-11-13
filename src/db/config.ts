import {TypeOrmModule} from "@nestjs/typeorm";
import { EventEntity } from "src/event/entity";

const DbModule = TypeOrmModule.forRoot({
    type:"mysql",
    host:"127.0.0.1",
    port: 3306,
    username:"root",
    password:"example",
    database:"nest-events",
    entities:[EventEntity],
    synchronize:true

})

export default DbModule;