import {Module} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";

import { UserEntity } from "./entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtStrategy, LocalStrategy } from "./strategy";

@Module({
    imports:[
        TypeOrmModule.forFeature([UserEntity]), 
        PassportModule, 
        JwtModule.registerAsync({
            useFactory:() => ({signOptions:{expiresIn:"3h"}, secret:process.env.SERVER_SECRET})
        })
    ],
    controllers:[UserController],
    providers:[UserService,LocalStrategy, JwtStrategy]
})

export class UserModule {

}
