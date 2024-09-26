/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateArchivoDto } from './dto/create-archivo.dto';
import { UpdateArchivoDto } from './dto/update-archivo.dto';
import { Archivo } from './entities/archivo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resultado } from 'src/resultado/entities/resultado.entity';

@Injectable()
export class ArchivosService {
  constructor(
    @InjectRepository(Archivo)
    private archivoRepository: Repository<Archivo>,
    @InjectRepository(Resultado)
    private ResultadoRepository: Repository<Resultado>,
  ) {}

  async create(createArchivoDto: CreateArchivoDto) {
     const resul = await this.ResultadoRepository.findOne({
       where: { ID: createArchivoDto.id_resultado },
     });
     if (!resul) {
       throw new Error('Programa no encontrado');
     }
     const archivo = new Archivo();
      archivo.Codigo = createArchivoDto.Codigo;
      archivo.Nombre = createArchivoDto.Nombre;
      archivo.Fecha_Creacion = createArchivoDto.Fecha_Creacion;
      archivo.Tamaño = createArchivoDto.Tamaño;
      archivo.Link = createArchivoDto.Link;
      archivo.resultado = resul; // Asignar el Programa encontrado

     return this.archivoRepository.save(archivo);
  }

  findAll() {
    return `This action returns all archivos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} archivo`;
  }

  update(id: number, updateArchivoDto: UpdateArchivoDto) {
    return `This action updates a #${id} archivo`;
  }

  remove(id: number) {
    return `This action removes a #${id} archivo`;
  }
}
