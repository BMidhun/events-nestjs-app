import {Controller, Post, UseGuards, ValidationPipe, Body} from "@nestjs/common";
import { CurrentUser } from "./current-user.decorator";
import { RegisterDTO } from "./dto/register.dto";
import { UserEntity } from "./entity";
import { LocalAuthGuard } from "./guards";
import { UserService } from "./user.service";
@Controller("user")

export class UserController {

    constructor(private userService:UserService) {

    }
    
    @UseGuards(LocalAuthGuard) // AuthGuard("local") will call the validate method in LocalStrategy. The "local" value is the default name for the PassportStrategy passes Strategy from passport-local.
    @Post("login")
    async login (@CurrentUser() user:UserEntity) {
        // perform login operation
        return await this.userService.login(user);
    }

    @Post("register")
    async register (@Body(new ValidationPipe({transform:true,whitelist:true})) body:RegisterDTO) {
        return await this.userService.register(body);
    }
}