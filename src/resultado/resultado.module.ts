/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ResultadoService } from './resultado.service';
import { ResultadoController } from './resultado.controller';
import { Resultado } from './entities/resultado.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetenciaModule } from 'src/competencia/competencia.module';

@Module({
  imports: [TypeOrmModule.forFeature([Resultado]), CompetenciaModule],
  controllers: [ResultadoController],
  providers: [ResultadoService],
})
export class ResultadoModule {}
