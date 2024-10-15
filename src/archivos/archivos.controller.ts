/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ArchivosService } from './archivos.service';
import { CreateArchivoDto } from './dto/create-archivo.dto';
import { UpdateArchivoDto } from './dto/update-archivo.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('archivos')
export class ArchivosController {
  constructor(private readonly archivosService: ArchivosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file')) // Multer interceptor
  async create(
    @Body() createArchivoDto: CreateArchivoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('Datos recibidos:', createArchivoDto);
    console.log('Archivo recibido:', file);
    return this.archivosService.create(createArchivoDto, file); // Crea el archivo y sube el PDF
  }

  @Get()
  findAll() {
    return this.archivosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.archivosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArchivoDto: UpdateArchivoDto) {
    return this.archivosService.update(id, updateArchivoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.archivosService.remove(id);
  }
}
