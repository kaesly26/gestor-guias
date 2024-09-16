/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCompetenciaDto } from './dto/create-competencia.dto';
import { UpdateCompetenciaDto } from './dto/update-competencia.dto';
import { Competencia } from './entities/competencia.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CompetenciaService {
  constructor(
    @InjectRepository(Competencia)
    private competenciaRepository: Repository<Competencia>,
  ) {}

  async create(
    createCompetenciaDto: CreateCompetenciaDto,
  ): Promise<Competencia> {
    try {
      const competencia =
        this.competenciaRepository.create(createCompetenciaDto);
      return await this.competenciaRepository.save(competencia);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la competencia');
    }
  }
  async findAll(): Promise<Competencia[]> {
    return this.competenciaRepository.find();
  }

  findOne(Codigo: string): Promise<Competencia | null> {
    const comp = this.competenciaRepository.findOneBy({ Codigo });
    if (!comp) {
      throw new NotFoundException(`Competencia not found`);
    } else {
      return comp;
    }
  }

  async update(
    Codigo: string,
    updateProgramaDto: UpdateCompetenciaDto,
  ): Promise<Competencia> {
    const comp = await this.competenciaRepository.findOneBy({ Codigo });
    if (!comp) {
      throw new NotFoundException(`competencia with Codigo ${Codigo} not found`);
    }

    Object.assign(comp, updateProgramaDto);
    return this.competenciaRepository.save(comp);
  }

  async remove(id: number): Promise<void> {
    await this.competenciaRepository.delete(id);
  }
}
