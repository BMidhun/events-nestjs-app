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
    @Transform(({value}) => new Date(value))
    @IsDate()
    when: Date;

    @IsNotEmpty()
    @IsString()
    address:string
}