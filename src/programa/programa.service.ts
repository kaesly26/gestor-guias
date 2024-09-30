/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';
import { Programa } from './entities/programa.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Competencia } from 'src/competencia/entities/competencia.entity';

@Injectable()
export class ProgramaService {
  constructor(
    @InjectRepository(Programa)
    private programaRepository: Repository<Programa>,
    @InjectRepository(Competencia)
    private competenciaRepository: Repository<Competencia>
  ) {}

  async create(createProgramaDto: CreateProgramaDto): Promise<Programa> {
    const programa = this.programaRepository.create(createProgramaDto);
    return this.programaRepository.save(programa);
  }

  async findAll(): Promise<Programa[]> {
    return this.programaRepository.find({ relations: ['competencias'] });
  }

  findOne(Codigo: string): Promise<Programa | null> {
    const programa = this.programaRepository.findOneBy({ Codigo });
    if (!programa) {
      throw new NotFoundException(`Programa not found`);
    } else {
      return programa;
    }
  }

  async update(
    Codigo: string,
    updateProgramaDto: UpdateProgramaDto,
  ): Promise<Programa> {
    const programa = await this.programaRepository.findOneBy({ Codigo });
    if (!programa) {
      throw new NotFoundException(`Programa with Codigo ${Codigo} not found`);
    }

    Object.assign(programa, updateProgramaDto);
    return this.programaRepository.save(programa);
  }

  async remove(Codigo: string): Promise<void> {
    const result = await this.programaRepository.delete({ Codigo });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Programa con código ${Codigo} no encontrado`,
      );
    }
  }
  
  // Método para agregar una competencia a un programa
  async addCompetenciaToPrograma(programaId: number, competenciaId: number) {
    // Obtener el programa con sus competencias relacionadas
    const programa = await this.programaRepository.findOne({
      where: { ID: programaId },
      relations: ['competencias'], // Incluye la relación con competencias
    });

    // Obtener la competencia por su ID
    const competencia = await this.competenciaRepository.findOneBy({
      ID: competenciaId,
    });

    // Verificar si ambos existen
    if (!programa || !competencia) {
      throw new NotFoundException('Programa o Competencia no encontrados');
    }

    // Agregar la competencia al array de competencias del programa
    programa.competencias.push(competencia);

    // Guardar el programa con la nueva relación
    return await this.programaRepository.save(programa);
  }
}
