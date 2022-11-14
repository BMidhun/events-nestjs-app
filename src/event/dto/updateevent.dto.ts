// import {Type} from "class-transformer";
// import {IsOptional, IsString,IsDate} from "class-validator";
import {PartialType} from "@nestjs/mapped-types"
import { CreateEventDTO } from "./createevent.dto";

export class UpdateEventDTO extends PartialType(CreateEventDTO) {

}

//OR 

// export class UpdateEventDTO {

//     @IsOptional()
//     @IsString()
//     name:string;

//     @IsOptional()
//     @IsString()
//     description:string;

//     @IsOptional()
//     @Type(() => Date)
//     @IsDateString()
//     when: Date;

//     @IsOptional()
//     @IsString()
//     address:string
// }