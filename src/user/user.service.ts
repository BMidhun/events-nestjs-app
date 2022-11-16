import {Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {verify as argonVerify} from "argon2"

import { UserEntity } from "./entity";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
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

}