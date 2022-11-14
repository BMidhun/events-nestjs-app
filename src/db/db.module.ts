import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DB_DEVCONFIG, DB_PRODCONFIG } from "src/config";

@Module({
    imports:[TypeOrmModule.forRootAsync({
        useFactory: process.env.NODE_ENV !== "production" ? DB_DEVCONFIG : DB_PRODCONFIG
    })],
    exports:[TypeOrmModule]
    
})

export class DBModule {

}