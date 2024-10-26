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
import { CompetenciaService } from './competencia.service';
import { CreateCompetenciaDto } from './dto/create-competencia.dto';
import { UpdateCompetenciaDto } from './dto/update-competencia.dto';
import { Roles } from 'src/roles/decorator/role.decorator';

@Controller('competencia')
export class CompetenciaController {
  constructor(private readonly competenciaService: CompetenciaService) {}

  @Post()
  @Roles('Admin')
  create(@Body() createCompetenciaDto: CreateCompetenciaDto) {
    return this.competenciaService.create(createCompetenciaDto);
  }

  @Get()
  @Roles('Admin')
  findAll() {
    return this.competenciaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.competenciaService.findOne(id);
  }

  @Patch(':Codigo')
  @Roles('Admin')
  update(
    @Param('Codigo') Codigo: string,
    @Body() updateCompetenciaDto: UpdateCompetenciaDto,
  ) {
    return this.competenciaService.update(Codigo, updateCompetenciaDto);
  }

  @Delete(':Codigo')
  @Roles('Admin')
  remove(@Param('Codigo') Codigo: string) {
    return this.competenciaService.remove(Codigo);
  }

  @Get('lista')
  async getCompetencias() {
    return this.competenciaService.findAll();
  }
}
