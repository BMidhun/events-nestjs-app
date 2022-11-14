import {IsOptional, IsInt, IsString,IsIn} from "class-validator";
import {Transform, Type} from "class-transformer";

type ORDERBY_TYPE = "asc"| "desc"| "ASC" | "DESC";

const ORDERBY_ALLOWED_VALUES:ORDERBY_TYPE[] = ["asc","desc","ASC","DESC"];




export class GetAllEventsDTO {

    @IsOptional()
    @Type(() => Number)
   
    @IsInt()
    limit:number = 10;
    
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    skip:number = 0;
    
    @IsOptional()
    @IsString()
    search:string = "";
    
    @IsOptional()
    @IsIn(ORDERBY_ALLOWED_VALUES)
    orderBy:ORDERBY_TYPE = ORDERBY_ALLOWED_VALUES[0];
}