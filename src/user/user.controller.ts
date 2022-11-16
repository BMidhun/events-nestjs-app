import {Controller, Post, UseGuards, Request, Body} from "@nestjs/common";
import { RegisterDTO } from "./dto/register.dto";
import { LocalAuthGuard } from "./guards";
import { UserService } from "./user.service";
@Controller("user")

export class UserController {

    constructor(private userService:UserService) {

    }
    
    @UseGuards(LocalAuthGuard) // AuthGuard("local") will call the validate method in LocalStrategy. The "local" value is the default name for the PassportStrategy passes Strategy from passport-local.
    @Post("login")
    async login (@Request() req) {
        // perform login operation
        return await this.userService.login(req.user);
    }

    @Post("register")
    async register (@Body() body:RegisterDTO) {
        
    }
}