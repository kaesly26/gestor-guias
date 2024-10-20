/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProgramaService } from './programa.service';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';

@Controller('programa')
export class ProgramaController {
  constructor(private readonly programaService: ProgramaService) {}

  @Post()
  create(@Body() createProgramaDto: CreateProgramaDto) {
    return this.programaService.create(createProgramaDto);
  }

  @Get()
  findAll() {
    return this.programaService.findAll();
  }

  @Get(':Codigo')
  findOne(@Param('Codigo') Codigo: string) {
    return this.programaService.findOne(Codigo);
  }

  @Patch(':Codigo')
  update(
    @Param('Codigo') Codigo: string,
    @Body() updateProgramaDto: UpdateProgramaDto,
  ) {
    return this.programaService.update(Codigo, updateProgramaDto);
  }

  // Endpoint para agregar una competencia a un programa
  @Post('add-competencia')
  async addCompetenciaToPrograma(
    @Body('programaId') programaId: number,
    @Body('competenciaIds') competenciaIds: number[],
  ) {
    // Llama al servicio para agregar la competencia al programa
    return this.programaService.addCompetenciaToPrograma(
      programaId,
      competenciaIds,
    );
  }

  @Delete('eliminar-todas-relaciones')
  deleteAllCompetenciasFromPrograma(@Body() body: { programaId: number }) {
    console.log(
      `Eliminar todas las relaciones del programaId = ${body.programaId}`,
    );
    return this.programaService.deleteAllCompetenciasFromPrograma(
      body.programaId,
    );
  }

  // @Delete('eliminar-relacion')
  // deleteCompetenciaFromPrograma(
  //   @Body('programaId') programaId: number,
  //   @Body('competenciaId') competenciaId: number,
  // ) {
  //   console.log(
  //     `Eliminar relación: programaId=${programaId}, competenciaId=${competenciaId}`,
  //   );
  //   return this.programaService.deleteCompetenciaFromPrograma(
  //     programaId,
  //     competenciaId,
  //   );
  // }
  @Delete(':Codigo')
  remove(@Param('Codigo') Codigo: string) {
    console.log('estoy aqui :(');
    return this.programaService.remove(Codigo);
  }
}
