import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Contract } from './app.contract';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, Contract],
  exports: [Contract], // 다른 모듈에서 사용할 수 있도록 export
})
export class AppModule {}
