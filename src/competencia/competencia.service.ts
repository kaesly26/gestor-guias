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
// import { Programa } from 'src/programa/entities/programa.entity';

@Injectable()
export class CompetenciaService {
  constructor(
    @InjectRepository(Competencia)
    private competenciaRepository: Repository<Competencia>,
    // @InjectRepository(Programa)
    // private programaRepository: Repository<Programa>,
  ) {}

  async create(
    createCompetenciaDto: CreateCompetenciaDto,
  ): Promise<Competencia> {
    const comp = this.competenciaRepository.create(createCompetenciaDto);
    return this.competenciaRepository.save(comp);

    // Buscar el Programa con el ID proporcionado
    // const programa = await this.programaRepository.findOne({
    //   where: { ID: createCompetenciaDto.id_programa },
    // });
    // if (!programa) {
    //   throw new Error('Programa no encontrado');
    // }

    // // Crear una nueva Competencia y asignar el Programa
    // const competencia = new Competencia();
    // competencia.Codigo = createCompetenciaDto.Codigo;
    // competencia.Nombre = createCompetenciaDto.Nombre;
    // competencia.Descripcion = createCompetenciaDto.Descripcion;
    // competencia.Tipo = createCompetenciaDto.Tipo;
    // competencia.programa = programa; // Asignar el Programa encontrado

    // return this.competenciaRepository.save(competencia);
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

  async remove(id: number): Promise<void> {
    await this.competenciaRepository.delete(id);
  }
}
