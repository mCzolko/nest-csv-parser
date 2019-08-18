import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppParser } from './app.parser';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AppParser],
})
export class AppModule {}
