/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResultadoDto } from './dto/create-resultado.dto';
import { UpdateResultadoDto } from './dto/update-resultado.dto';
import { Resultado } from './entities/resultado.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Competencia } from 'src/competencia/entities/competencia.entity';

@Injectable()
export class ResultadoService {
  constructor(
    @InjectRepository(Resultado)
    private ResultadoRepository: Repository<Resultado>,
    @InjectRepository(Competencia)
    private CompetenciaRepository: Repository<Competencia>
  ) {}

  async create(createResultadoDto: CreateResultadoDto){
    // const resul = this.ResultadoRepository.create(createResultadoDto);
    // return this.ResultadoRepository.save(resul);

      const resul = await this.CompetenciaRepository.findOne({
        where: { ID: createResultadoDto.id_competencia },
      });
      if (!resul) {
        throw new Error('Programa no encontrado');
      }
      const resultado = new Resultado();
      resultado.Codigo = createResultadoDto.Codigo;
      resultado.Nombre = createResultadoDto.Nombre;
      resultado.Descripcion = createResultadoDto.Descripcion;
      resultado.competencia = resul; // Asignar el Programa encontrado

    return this.ResultadoRepository.save(resultado);
  }

  async findAll(): Promise<Resultado[]> {
    return this.ResultadoRepository.find({ relations: ['competencia','archivos'] });
  }

  findOne(Codigo: string): Promise<Resultado | null> {
    const programa = this.ResultadoRepository.findOneBy({ Codigo });
    if (!programa) {
      throw new NotFoundException(`Programa not found`);
    } else {
      return programa;
    }
  }

  async update(
    Codigo: string,
    updateResultadoDto: UpdateResultadoDto,
  ): Promise<Resultado> {
    const programa = await this.ResultadoRepository.findOneBy({ Codigo });
    if (!programa) {
      throw new NotFoundException(`Programa with Codigo ${Codigo} not found`);
    }

    Object.assign(programa, updateResultadoDto);
    return this.ResultadoRepository.save(programa);
  }

  async remove(Codigo: string): Promise<void> {
    await this.ResultadoRepository.delete({Codigo});
  }
}
