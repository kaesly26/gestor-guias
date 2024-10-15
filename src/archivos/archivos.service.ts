/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArchivoDto } from './dto/create-archivo.dto';
import { UpdateArchivoDto } from './dto/update-archivo.dto';
import { Archivo } from './entities/archivo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 as cloudinary} from 'cloudinary';

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

  // async uploadToCloudinary(
  //   file: Express.Multer.File,
  // ): Promise<UploadApiResponse> {
  //   return new Promise((resolve, reject) => {
  //     cloudinary.uploader
  //       .upload_stream({ resource_type: 'auto' }, (error, result) => {
  //         if (error) return reject(error);
  //         resolve(result);
  //       })
  //       .end(file.buffer);
  //   });
  // }

  async create(
    createArchivoDto: CreateArchivoDto,
    file: Express.Multer.File,
  ): Promise<Archivo> {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado un archivo.');
    }
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'raw',
      public_id: createArchivoDto.Codigo,
    });
    const archivo = this.archivoRepository.create({
      ...createArchivoDto,
      Link: result.secure_url,
    });
    return this.archivoRepository.save(archivo);
    // const uploadResult = await this.uploadToCloudinary(file);
    // createArchivoDto.Link = uploadResult.secure_url; // Guarda la URL de Cloudinary

    // const archivo = this.archivoRepository.create(createArchivoDto);
    // return this.archivoRepository.save(archivo);
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
    await this.archivoRepository.delete(Codigo);
  }
}
