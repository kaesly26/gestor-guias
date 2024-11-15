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
import { Roles } from 'src/roles/decorator/role.decorator';

@Controller('programa')
export class ProgramaController {
  constructor(private readonly programaService: ProgramaService) {}

  @Post()
  @Roles('Admin')
  create(@Body() createProgramaDto: CreateProgramaDto) {
    return this.programaService.create(createProgramaDto);
  }

  @Get()
  @Roles('Admin')
  findAll() {
    return this.programaService.findAll();
  }

  @Get(':Codigo')
  @Roles('Admin')
  findOne(@Param('Codigo') Codigo: string) {
    return this.programaService.findOne(Codigo);
  }

  @Patch(':Codigo')
  @Roles('Admin')
  update(
    @Param('Codigo') Codigo: string,
    @Body() updateProgramaDto: UpdateProgramaDto,
  ) {
    return this.programaService.update(Codigo, updateProgramaDto);
  }

  // Endpoint para agregar una competencia a un programa
  @Post('add-competencia')
  @Roles('Admin')
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
  @Roles('Admin')
  deleteAllCompetenciasFromPrograma(@Body() body: { programaId: number }) {
    console.log(
      `Eliminar todas las relaciones del programaId = ${body.programaId}`,
    );
    return this.programaService.deleteAllCompetenciasFromPrograma(
      body.programaId,
    );
  }
  @Delete('relacion-especifica')
  @Roles('Admin')
  async deleteRelacionEspecifica(
    @Body() body: { programaId: number; competenciaId: number },
  ) {
    const { programaId, competenciaId } = body;

    // Lógica para eliminar la relación específica
    await this.programaService.deleteRelacionEspecifica(
      programaId,
      competenciaId,
    );
    return { message: 'Relación eliminada exitosamente' };
  }

  @Delete(':Codigo')
  @Roles('Admin')
  remove(@Param('Codigo') Codigo: string) {
    return this.programaService.remove(Codigo);
  }
}
