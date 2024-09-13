/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';
import { Programa } from './entities/programa.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProgramaService {
  programas = [];
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
    return this.programaRepository.findOneBy({ Codigo });
  }

  update(id: string, updateProgramaDto: UpdateProgramaDto) {
    return `This action updates a #${id} programa`;
  }

  async remove(Codigo: string): Promise<void> {
    await this.programaRepository.delete(Codigo);
  }
}
