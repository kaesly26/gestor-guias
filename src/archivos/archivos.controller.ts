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
import { Roles } from 'src/roles/decorator/role.decorator';
import { Archivo } from './entities/archivo.entity';
import { Competencia } from 'src/competencia/entities/competencia.entity';
import { Resultado } from 'src/resultado/entities/resultado.entity';
import { Programa } from 'src/programa/entities/programa.entity';

@Controller('archivos')
export class ArchivosController {
  constructor(private readonly archivosService: ArchivosService) {}

  @Post('guardar')
  @Roles('Admin', 'Coordinador')
  async create(@Body() createArchivoDto: CreateArchivoDto) {
    console.log('solicitud recibida');
    console.log('Datos recibidos:', createArchivoDto);
    return this.archivosService.create(createArchivoDto); // Crea el archivo y sube el PDF
  }

  @Post('subir')
  @Roles('Admin', 'Coordinador', 'Instructor')
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
  @Roles('Admin', 'Coordinador', 'Instructor')
  findAll() {
    return this.archivosService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'Coordinador', 'Instructor')
  findOne(@Param('id') id: string) {
    return this.archivosService.findOne(id);
  }
  // Filtro de archivos
  @Get('usuario/:usuarioId')
  async obtenerDatosDeCompetenciasDeUsuario(
    @Param('usuarioId') usuarioId: number,
  ): Promise<{
    archivos: {
      archivo: Archivo;
      resultado: Resultado;
      competencia: Competencia;
      programa: Programa;
    }[];
  }> {
    return this.archivosService.obtenerDatosDeCompetenciasDeUsuario(usuarioId);
  }

  @Patch(':Codigo')
  @Roles('Admin', 'Coordinador', 'Instructor')
  update(
    @Param('Codigo') Codigo: string,
    @Body() updateArchivoDto: UpdateArchivoDto,
  ) {
    return this.archivosService.update(Codigo, updateArchivoDto);
  }

  @Delete(':Codigo')
  @Roles('Admin', 'Coordinador', 'Instructor')
  remove(@Param('Codigo') Codigo: string) {
    return this.archivosService.remove(Codigo);
  }
}
