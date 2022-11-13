import {Transform} from "class-transformer";
import {IsNotEmpty, IsString,IsDate} from "class-validator";

export class CreateEventDTO {

    @IsNotEmpty()
    @IsString()
    name:string;

    @IsNotEmpty()
    @IsString()
    description:string;

    @IsNotEmpty()
    @Transform(() => Date)
    @IsDate()
    when: Date;

    @IsNotEmpty()
    @IsString()
    address:string
}