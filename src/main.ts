import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,
    {
      // logger:["error","warn","debug"]  // this option will set the logger to display only the specified types of logs in the console.
    }
    );
  await app.listen(3001);
}
bootstrap();
