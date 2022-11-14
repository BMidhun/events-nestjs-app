import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DBModule } from './db/db.module';
import { EventModule } from './event/event.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    DBModule,
    EventModule]
})
export class AppModule {}
