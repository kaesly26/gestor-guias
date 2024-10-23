/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProgramaService } from './programa.service';
import { ProgramaController } from './programa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Programa } from './entities/programa.entity';
import { Competencia } from 'src/competencia/entities/competencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Programa, Competencia])],
  controllers: [ProgramaController],
  providers: [ProgramaService],
  exports: [TypeOrmModule, ProgramaService],
})
export class ProgramaModule {}
