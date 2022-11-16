import {Module} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity";
import { LocalStrategy } from "./strategy/local.strategy";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports:[TypeOrmModule.forFeature([UserEntity])],
    controllers:[UserController],
    providers:[UserService,LocalStrategy]
})

export class UserModule {

}
