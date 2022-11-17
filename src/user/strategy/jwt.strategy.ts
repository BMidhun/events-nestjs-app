import {Injectable, NotFoundException} from "@nestjs/common"
import { Strategy } from "passport-jwt";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt} from "passport-jwt"
import { ConfigService } from "@nestjs/config";
import { UserService } from "../user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
    
    constructor(config:ConfigService, private userService:UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey:config.get("SERVER_SECRET") //or we can use process.env.SERVER_SECRET
        })
    }

    async validate(payload:any) {
       const {userId} = payload
       const user = await this.userService.getUserById(userId);
       if(!user)
            throw new NotFoundException("User not found")
        return user;
    }
}