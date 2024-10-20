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
    private competenciaRepository: Repository<Competencia>,
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

  // Método para agregar competencias a un programa
  async addCompetenciaToPrograma(programaId: number, competenciaIds: number[]) {
    const programa = await this.programaRepository.findOne({
      where: { ID: programaId },
      relations: ['competencias'],
    });
    if (!programa) {
      throw new NotFoundException('Programa no encontrado');
    }

    for (const competenciaId of competenciaIds) {
      const competencia = await this.competenciaRepository.findOneBy({
        ID: competenciaId,
      });

      if (!competencia) {
        throw new NotFoundException(
          `Competencia con ID ${competenciaId} no encontrada`,
        );
      }

      if (!programa.competencias.some((c) => c.ID === competencia.ID)) {
        programa.competencias.push(competencia);
      }
    }

    return await this.programaRepository.save(programa);
  }

  async deleteAllCompetenciasFromPrograma(programaId: number): Promise<void> {
    const programa = await this.programaRepository.findOne({
      where: { ID: programaId },
      relations: ['competencias'],
    });

    if (!programa) {
      throw new NotFoundException('Programa no encontrado');
    }

    // Verificar si el programa tiene competencias asociadas
    if (programa.competencias.length === 0) {
      console.log('No hay competencias para eliminar');
      return;
    }

    // Eliminar todas las relaciones
    await this.programaRepository
      .createQueryBuilder()
      .relation(Programa, 'competencias')
      .of(programa)
      .remove(programa.competencias);

    console.log(
      `Se eliminaron todas las competencias del programa con ID=${programaId}`,
    );
  }

  // async deleteCompetenciaFromPrograma(
  //   programaId: number,
  //   competenciaId: number,
  // ): Promise<void> {
  //   const programa = await this.programaRepository.findOne({
  //     where: { ID: programaId },
  //     relations: ['competencias'],
  //   });

  //   if (!programa) {
  //     throw new NotFoundException('Programa no encontrado');
  //   }

  //   const competenciaIndex = programa.competencias.findIndex(
  //     (c) => c.ID === competenciaId,
  //   );
  //   if (competenciaIndex === -1) {
  //     throw new NotFoundException(
  //       `Competencia con ID ${competenciaId} no está asociada a este programa`,
  //     );
  //   }

  //   await this.programaRepository
  //     .createQueryBuilder()
  //     .relation(Programa, 'competencias')
  //     .of(programaId)
  //     .remove(competenciaId);
  // }
}
