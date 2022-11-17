import {Injectable, BadRequestException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {verify as argonVerify, hash as argonHash} from "argon2"
import {JwtService} from "@nestjs/jwt"

import { UserEntity } from "./entity";
import { RegisterDTO } from "./dto/register.dto";

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

    private createToken(payload) {
        return this.jwtService.sign(payload);
    }

    async login(user:UserEntity) {
        const payload = {username:user.email, sub:user.id}
        return {
            access_token: this.createToken(payload)
        }
    }


    async getUserById(id:number) {
        const user = await this.userRepository.createQueryBuilder("e").where("e.id =:id", {id}).getOne()
        return user;
    }

    async register(payload: RegisterDTO) {
        const {email,password} = payload

        const user = await this.userRepository.findOne({where:{email}});

        if(user)
            throw new BadRequestException("User already exists");
        
        const hashedPassword = await argonHash(password,{saltLength:12});

        const savedUser = await this.userRepository.save({
            ...payload,
            password:hashedPassword
        });

        const access_token = this.createToken({sub:savedUser.id, username:savedUser.email});

        return {access_token}
        
    }

}