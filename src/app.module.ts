/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramaModule } from './programa/programa.module';
import { Programa } from './programa/entities/programa.entity';
import { CompetenciaModule } from './competencia/competencia.module';
import { Competencia } from './competencia/entities/competencia.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'nuevaconexion',
      database: 'gestor_guias',
      entities: [Programa, Competencia],
      synchronize: true,
    }),
    ProgramaModule,
    CompetenciaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
