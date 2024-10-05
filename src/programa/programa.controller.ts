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
import { Programa } from './entities/programa.entity';

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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProgramaDto: UpdateProgramaDto,
  ) {
    return this.programaService.update(id, updateProgramaDto);
  }

  @Delete(':Codigo')
  remove(@Param('Codigo') Codigo: string) {
    return this.programaService.remove(Codigo);
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
  //obtner el listado de relaciones
  @Get('lista-relacion')
  async getLista(): Promise<Programa[]> {
    const programas = await this.programaService.getLista();
    console.log('Programas:', programas);
    return programas.length > 0 ? programas : [];
  }
}
