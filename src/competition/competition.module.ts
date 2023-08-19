import { Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionHandler } from 'src/common/exception/exceptionHandler';
import { CompetitionController } from './controller/competition.controller';
import { CompetitionService } from './service/competition.service';

@Module({
  imports: [HttpModule, CompetitionModule],
  controllers: [CompetitionController],
  providers: [
    Logger,
    { provide: APP_FILTER, useClass: ExceptionHandler },
    CompetitionService,
  ],
})
export class CompetitionModule {}
