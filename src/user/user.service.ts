import {Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {verify as argonVerify} from "argon2"
import {JwtService} from "@nestjs/jwt"

import { UserEntity } from "./entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,

        private jwtService:JwtService    
        ) {}

    async validateUser(email:string, password:string) {
        const user = await this.userRepository.findOne({where:{email}})
        if(!user)
            return null

        const valid = await argonVerify(user.password,password);

        if(!valid)
            return null
        
        return user; 
    }

    async login(user:UserEntity) {
        const payload = {username:user.email, sub:user.id}
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

}