import {NotFoundException,Injectable} from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from "passport-local"
import { UserService } from "../user.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private userService: UserService) {
        super({usernameField:"email"});
    }

    async validate(username:string,password:string) {
        const user = this.userService.validateUser(username,password);
        if(!user)
            throw new NotFoundException("User not found");
        return user;
    }
}