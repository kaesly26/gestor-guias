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
  BadRequestException,
} from '@nestjs/common';
import { ArchivosService } from './archivos.service';
import { CreateArchivoDto } from './dto/create-archivo.dto';
import { UpdateArchivoDto } from './dto/update-archivo.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('archivos')
export class ArchivosController {
  constructor(private readonly archivosService: ArchivosService) {}

  @Post('guardar')
  async create(@Body() createArchivoDto: CreateArchivoDto) {
    console.log('solicitud recibida');
    console.log('Datos recibidos:', createArchivoDto);
    return this.archivosService.create(createArchivoDto); // Crea el archivo y sube el PDF
  }
  @Post('subir')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado un archivo.');
    }

    // Subir el archivo y obtener la URL
    const uploadResult = await this.archivosService.uploadToCloudinary(file);
    return {
      message: 'Archivo subido correctamente',
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };
  }

  @Get()
  findAll() {
    return this.archivosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.archivosService.findOne(id);
  }

  @Patch(':Codigo')
  update(
    @Param('Codigo') Codigo: string,
    @Body() updateArchivoDto: UpdateArchivoDto,
  ) {
    return this.archivosService.update(Codigo, updateArchivoDto);
  }

  @Delete(':Codigo')
  remove(@Param('Codigo') Codigo: string) {
    return this.archivosService.remove(Codigo);
  }
}
