/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { ArchivosService } from './archivos.service';
import { ArchivosController } from './archivos.controller';
import { ResultadoModule } from 'src/resultado/resultado.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Archivo } from './entities/archivo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Archivo]),
    forwardRef(() => ResultadoModule),
  ],
  controllers: [ArchivosController],
  providers: [ArchivosService],
})
export class ArchivosModule {}
