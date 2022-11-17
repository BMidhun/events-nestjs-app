import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import { Observable } from "rxjs";
import { EventService } from "../event.service";

@Injectable()
export class OwnEventGuard implements CanActivate {


    constructor(private eventService: EventService) {
        
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        
        const {user,params:{id:eventId}} = context.switchToHttp().getRequest();   

        return this.eventService.getEvent(Number(eventId))
                .then((event) => {
                    return event.organizer.id === user.id;
                })
                .catch(() => false)


    }

}