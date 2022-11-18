import {IsEnum} from "class-validator"
import { AttendeeAnswerEnum } from "../entity";

export class AttendeeStatusDTO {

    @IsEnum(AttendeeAnswerEnum)
    answer: AttendeeAnswerEnum

}