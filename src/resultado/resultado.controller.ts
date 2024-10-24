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
import { ResultadoService } from './resultado.service';
import { CreateResultadoDto } from './dto/create-resultado.dto';
import { UpdateResultadoDto } from './dto/update-resultado.dto';
import { Roles } from 'src/roles/decorator/role.decorator';

@Controller('resultado')
export class ResultadoController {
  constructor(private readonly resultadoService: ResultadoService) {}

  @Post()
  @Roles('Admin')
  create(@Body() createResultadoDto: CreateResultadoDto) {
    return this.resultadoService.create(createResultadoDto);
  }

  @Get()
  @Roles('Admin')
  findAll() {
    return this.resultadoService.findAll();
  }

  @Get(':id')
  @Roles('Admin')
  findOne(@Param('id') id: string) {
    return this.resultadoService.findOne(id);
  }

  @Patch(':id')
  @Roles('Admin')
  update(
    @Param('id') id: string,
    @Body() updateResultadoDto: UpdateResultadoDto,
  ) {
    return this.resultadoService.update(id, updateResultadoDto);
  }

  @Delete(':Codigo')
  @Roles('Admin')
  remove(@Param('Codigo') Codigo: string) {
    return this.resultadoService.remove(Codigo);
  }
}
