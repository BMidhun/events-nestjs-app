import {Injectable} from "@nestjs/common"
import { Strategy } from "passport-jwt";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt} from "passport-jwt"
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
    
    constructor(config:ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey:config.get("SERVER_SECRET") //or we can use process.env.SERVER_SECRET
        })
    }

    async validate(payload:any) {
        return {userId:payload.sub, username:payload.username}
    }
}