/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArchivoDto } from './dto/create-archivo.dto';
import { UpdateArchivoDto } from './dto/update-archivo.dto';
import { Archivo } from './entities/archivo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class ArchivosService {
  constructor(
    @InjectRepository(Archivo)
    private archivoRepository: Repository<Archivo>,
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: 'raw', upload_preset: 'GuiasSena' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async create(createArchivoDto: CreateArchivoDto): Promise<Archivo> {
    console.log('datos', createArchivoDto);
    try {
      const archivo = this.archivoRepository.create({
        ...createArchivoDto,
        resultado: { ID: createArchivoDto.id_resultado },
      });
      return this.archivoRepository.save(archivo);
    } catch (error) {
      console.error('error al subir el registro');
    }
  }

  async findAll(): Promise<Archivo[]> {
    return this.archivoRepository.find({ relations: ['resultado'] });
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
    console.log('codigo', Codigo);
    const archivo = await this.archivoRepository.findOneBy({ Codigo });
    if (!archivo) {
      throw new NotFoundException(
        `El archivo con código ${Codigo} no fue encontrado.`,
      );
    }
    try {
      await cloudinary.uploader.destroy(archivo.public_id, {
        resource_type: 'raw',
      });
      console.log('se elimino el archivo')
    } catch (error) {
      console.error('No se elimino el archivo de clouidnary')
    }
    try {
      await this.archivoRepository.delete({ Codigo });
      console.log('se elimino el registro')
    } catch (error) {
      console.error('no se elimino el registro')
    }
   
  }
}
