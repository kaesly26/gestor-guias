/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';
import { Programa } from './entities/programa.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProgramaService {
  constructor(
    @InjectRepository(Programa)
    private programaRepository: Repository<Programa>,
  ) {}

  async create(createProgramaDto: CreateProgramaDto): Promise<Programa> {
    const programa = this.programaRepository.create(createProgramaDto);
    return this.programaRepository.save(programa);
  }

  async findAll(): Promise<Programa[]> {
    return this.programaRepository.find();
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
    await this.programaRepository.delete(Codigo);
  }
}
