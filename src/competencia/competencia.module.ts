/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CompetenciaService } from './competencia.service';
import { CompetenciaController } from './competencia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competencia } from './entities/competencia.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Competencia])],
  controllers: [CompetenciaController],
  providers: [CompetenciaService],
})
export class CompetenciaModule {}
