import {IsOptional, IsInt, IsString,IsIn, IsEnum} from "class-validator";
import {Type} from "class-transformer";

type ORDERBY_TYPE = "ASC" | "DESC";

const ORDERBY_ALLOWED_VALUES:ORDERBY_TYPE[] = ["ASC","DESC"];

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
    @IsIn(ORDERBY_ALLOWED_VALUES)
    orderBy:ORDERBY_TYPE = ORDERBY_ALLOWED_VALUES[0];

    @IsOptional()
    @Type(() => Number)
    @IsEnum(WhenFilterEnum)
    whenFilter: WhenFilterEnum | undefined
}