/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
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
    archivo.Tamaño = createArchivoDto.Tamaño;
    archivo.Link = createArchivoDto.Link;
    archivo.resultado = resul; // Asignar el Programa encontrado

    return this.archivoRepository.save(archivo);
  }

  async findAll(): Promise<Archivo[]> {
    return this.archivoRepository.find();
  }

  findOne(Codigo: string): Promise<Archivo | null> {
    const programa = this.archivoRepository.findOneBy({ Codigo });
    if (!programa) {
      throw new NotFoundException(`archivo not found`);
    } else {
      return programa;
    }
  }

  async update(
    Codigo: string,
    updateArchivoDto: UpdateArchivoDto,
  ): Promise<Archivo> {
    const programa = await this.archivoRepository.findOneBy({ Codigo });
    if (!programa) {
      throw new NotFoundException(`archivo with Codigo ${Codigo} not found`);
    }

    Object.assign(programa, updateArchivoDto);
    return this.archivoRepository.save(programa);
  }

  async remove(Codigo: string): Promise<void> {
    await this.archivoRepository.delete(Codigo);
  }
}
