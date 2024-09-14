import { Module } from '@nestjs/common';
import { CompetenciaService } from './competencia.service';
import { CompetenciaController } from './competencia.controller';

@Module({
  controllers: [CompetenciaController],
  providers: [CompetenciaService],
})
export class CompetenciaModule {}
