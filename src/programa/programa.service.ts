import { Injectable } from '@nestjs/common';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';

@Injectable()
export class ProgramaService {
  programa = [
    {
      Codigo: '101',
      Nombre: 'cocina',
      Descripcion: 'njkjkvnjkdvnjnjrfdnjfnj',
    },
    {
      Codigo: '102',
      Nombre: 'software',
      Descripcion: 'njkjkvnjkdvnjnjrfdnjfnj',
    },
    {
      Codigo: '103',
      Nombre: 'nuvff',
      Descripcion: 'njkjkvnjkdvnjnjrfdnjfnj',
    },
  ];
  create(createProgramaDto: CreateProgramaDto) {
    this.programa.push(createProgramaDto);
    return this.programa;
  }

  findAll() {
    return this.programa;
  }

  findOne(id: string) {
    return this.programa.filter((p) => p.Codigo === id);
  }

  update(id: number, updateProgramaDto: UpdateProgramaDto) {
    return `This action updates a #${id} programa`;
  }

  remove(id: string) {
    codigo = this.programa.findIndex((p) => p.Codigo === id);
    return this.programa.splice(codigo, 1);
  }
}
