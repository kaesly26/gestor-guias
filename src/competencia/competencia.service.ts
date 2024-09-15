import { Injectable } from '@nestjs/common';
import { CreateCompetenciaDto } from './dto/create-competencia.dto';
import { UpdateCompetenciaDto } from './dto/update-competencia.dto';

@Injectable()
export class CompetenciaService {
  competencia: [];
  create(createCompetenciaDto: CreateCompetenciaDto) {
    return 'This action adds a new competencia';
  }

  findAll() {
    return `This action returns all competencia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} competencia`;
  }

  update(id: number, updateCompetenciaDto: UpdateCompetenciaDto) {
    return `This action updates a #${id} competencia`;
  }

  remove(id: number) {
    return `This action removes a #${id} competencia`;
  }
}
