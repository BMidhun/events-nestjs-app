import {IsEmail, IsString, IsNotEmpty} from "class-validator"

export class RegisterDTO {
   
    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    firstName:string;

    @IsNotEmpty()
    @IsString()
    lastName: string;
}