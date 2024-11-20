/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArchivoDto } from './dto/create-archivo.dto';
import { UpdateArchivoDto } from './dto/update-archivo.dto';
import { Archivo } from './entities/archivo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Resultado } from 'src/resultado/entities/resultado.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Competencia } from 'src/competencia/entities/competencia.entity';
import { Programa } from 'src/programa/entities/programa.entity';

@Injectable()
export class ArchivosService {
  constructor(
    @InjectRepository(Archivo)
    private archivoRepository: Repository<Archivo>,
    @InjectRepository(Resultado)
    private resultadoRepository: Repository<Resultado>,
    @InjectRepository(Usuario) private userRepository: Repository<Usuario>,
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

  async obtenerDatosDeCompetenciasDeUsuario(usuarioId: number): Promise<{
    archivos: {
      archivo: Archivo;
      resultado: Resultado;
      competencia: Competencia;
      programa: Programa;
    }[];
  }> {
    // Buscar al usuario y cargar sus competencias con programas asociados
    const usuario = await this.userRepository.findOne({
      where: { id: usuarioId },
      relations: ['competencias', 'competencias.programas'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    // Extraer IDs de competencias del usuario
    const competenciasIds = usuario.competencias.map(
      (competencia) => competencia.ID,
    );

    // Obtener resultados de aprendizaje con archivos y programas asociados
    const resultados = await this.resultadoRepository.find({
      where: {
        competencia: { ID: In(competenciasIds) },
      },
      relations: ['archivos', 'competencia', 'competencia.programas'],
    });

    // Construir respuesta con archivos, resultados, competencias y programas
    const archivos = resultados.flatMap((resultado) =>
      resultado.archivos.map((archivo) => {
        const competencia = resultado.competencia;
        const programa = competencia.programas[0]; // Asumimos un programa por competencia
        return {
          archivo,
          resultado,
          competencia,
          programa,
        };
      }),
    );

    return { archivos };
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
      console.log('se elimino el archivo');
    } catch (error) {
      console.error('No se elimino el archivo de clouidnary');
    }
    try {
      await this.archivoRepository.delete({ Codigo });
      console.log('se elimino el registro');
    } catch (error) {
      console.error('no se elimino el registro');
    }
  }
}
