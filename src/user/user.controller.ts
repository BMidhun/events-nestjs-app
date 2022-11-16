import {Controller, Post, UseGuards, Request} from "@nestjs/common";
import { LocalAuthGuard } from "./guards";
@Controller("user")

export class UserController {
    
    @UseGuards(LocalAuthGuard) // AuthGuard("local") will call the validate method in LocalStrategy. The "local" value is the default name for the PassportStrategy passes Strategy from passport-local.
    @Post("login")
    async login () {
        // perform login operation
    }
}