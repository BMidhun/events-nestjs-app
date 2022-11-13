import { Module } from '@nestjs/common';
import { EventModule } from './event/event.module';

@Module({
  imports: [],
  controllers: [EventModule],
  providers: [],
})
export class AppModule {}
