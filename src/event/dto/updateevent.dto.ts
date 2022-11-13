import {Transform} from "class-transformer";
import {IsOptional, IsString,IsDate} from "class-validator";

export class UpdateEventDTO {

    @IsOptional()
    @IsString()
    name:string;

    @IsOptional()
    @IsString()
    description:string;

    @IsOptional()
    @Transform(() => Date)
    @IsDate()
    when: Date;

    @IsOptional()
    @IsString()
    address:string
}