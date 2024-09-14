import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompetenciaService } from './competencia.service';
import { CreateCompetenciaDto } from './dto/create-competencia.dto';
import { UpdateCompetenciaDto } from './dto/update-competencia.dto';

@Controller('competencia')
export class CompetenciaController {
  constructor(private readonly competenciaService: CompetenciaService) {}

  @Post()
  create(@Body() createCompetenciaDto: CreateCompetenciaDto) {
    return this.competenciaService.create(createCompetenciaDto);
  }

  @Get()
  findAll() {
    return this.competenciaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.competenciaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompetenciaDto: UpdateCompetenciaDto) {
    return this.competenciaService.update(+id, updateCompetenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.competenciaService.remove(+id);
  }
}
