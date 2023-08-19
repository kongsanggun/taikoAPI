import { Logger, Module } from '@nestjs/common';
import { DonderController } from './controller/donder.controller';
import { CrawlingService } from './service/donder.service';
import { HttpModule } from '@nestjs/axios';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionHandler } from 'src/common/exception/exceptionHandler';

@Module({
  imports: [HttpModule, DonderModule],
  controllers: [DonderController],
  providers: [
    Logger,
    { provide: APP_FILTER, useClass: ExceptionHandler },
    CrawlingService,
  ],
})
export class DonderModule {}
