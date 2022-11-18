import {IsOptional, IsInt, IsString,IsIn, IsEnum} from "class-validator";
import {Type} from "class-transformer";

enum ORDERBY_ENUM {
    ASC = "ASC",
    DESC = "DESC"
}

export enum WhenFilterEnum {
    TODAY = 1,
    TOMORROW,
    THIS_WEEK,
    NEXT_WEEK,
    NEXT_MONTH
}


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
    @IsEnum(ORDERBY_ENUM)
    orderBy:ORDERBY_ENUM = ORDERBY_ENUM.ASC;

    @IsOptional()
    @Type(() => Number)
    @IsEnum(WhenFilterEnum)
    whenFilter: WhenFilterEnum | undefined
}