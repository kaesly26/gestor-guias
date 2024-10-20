/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramaModule } from './programa/programa.module';
import { Programa } from './programa/entities/programa.entity';
import { CompetenciaModule } from './competencia/competencia.module';
import { Competencia } from './competencia/entities/competencia.entity';
import { ResultadoModule } from './resultado/resultado.module';
import { Resultado } from './resultado/entities/resultado.entity';
import { ArchivosModule } from './archivos/archivos.module';
import { Archivo } from './archivos/entities/archivo.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Programa, Competencia, Resultado, Archivo],
      synchronize: true,
    }),
    ProgramaModule,
    CompetenciaModule,
    ResultadoModule,
    ArchivosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
