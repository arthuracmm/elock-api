import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getSequelizeConfig } from './config/database.config';
import { IndexModule } from './modules/index.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Esp32Module } from './modules/esp32/esp32.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getSequelizeConfig,
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    IndexModule,
    Esp32Module,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }
