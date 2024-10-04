/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const comp = this.competenciaRepository.create(createCompetenciaDto);
    return this.competenciaRepository.save(comp);
  }
  async findAll(): Promise<Competencia[]> {
    return this.competenciaRepository.find({ relations: ['resultados'] });
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
      throw new NotFoundException(
        `competencia with Codigo ${Codigo} not found`,
      );
    }

    Object.assign(comp, updateProgramaDto);
    return this.competenciaRepository.save(comp);
  }

  async remove(Codigo: string): Promise<void> {
    await this.competenciaRepository.delete({ Codigo });
  }

}
