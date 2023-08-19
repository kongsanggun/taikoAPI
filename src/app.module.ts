import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { DonderModule } from './donder/donder.module';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionHandler } from './common/exception/exceptionHandler';
import { ConfigModule } from '@nestjs/config';
import { CompetitionModule } from './competition/competition.module';
import envConfig from './common/config/envConfig';

@Module({
  imports: [
    HttpModule,
    DonderModule,
    CompetitionModule,
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      load: [envConfig],
      isGlobal: true,
    }),
    CompetitionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    { provide: APP_FILTER, useClass: ExceptionHandler },
  ],
})
export class AppModule {}
