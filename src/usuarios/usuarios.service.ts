import { Injectable, UseGuards } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/role-guard/role-guard.guard';
import { Roles } from 'src/roles/decorator/role.decorator';
import * as bcryptjs from 'bcryptjs';
import { Competencia } from 'src/competencia/entities/competencia.entity';

@UseGuards(AuthGuard, RolesGuard)
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private userRepository: Repository<Usuario>,
    @InjectRepository(Competencia)
    private competenciaRepository: Repository<Competencia>,
  ) {}

  @Roles('admin')
  async create(createUserDto: CreateUsuarioDto) {
    console.log(
      'contraseña que llega a usuario service:',
      createUserDto.password,
    );
    const password = await bcryptjs.hash(createUserDto.password, 10); // Encripta la contraseña

    createUserDto.password = password;
    console.log('la contraseña que se guarda:', password);
    // Crear el usuario con la contraseña encriptada

    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async agregarCompetenciasAUsuario(
    usuarioId: number,
    competenciasIds: number[],
  ): Promise<Usuario> {
    const usuario = await this.userRepository.findOne({
      where: { id: usuarioId },
      relations: ['competencias'], // Asegúrate de cargar las competencias
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado.');
    }

    const competencias =
      await this.competenciaRepository.findByIds(competenciasIds);

    if (!competencias.length) {
      throw new Error('No se encontraron competencias.');
    }

    usuario.competencias.push(...competencias);
    return await this.userRepository.save(usuario);
  }

  @Roles('admin')
  async findAll() {
    const users = await this.userRepository.find({
      relations: ['competencias', 'role'],
      select: ['id', 'name', 'email', 'cedula', 'telefono'],
    });
    return users;
  }

  // async findProgramasAsignados(id: number) {
  //   const user = await this.userRepository.findOne({
  //     where: { id },
  //     relations: ['programa'],
  //   });
  //   return user.programa;
  // }
  // async findProgramasNoAsignados(id: number) {
  //   // Obtener el usuario con los programas asignados
  //   const user = await this.userRepository.findOne({
  //     where: { id },
  //     relations: ['programa'],
  //   });

  //   // Obtener todos los programas
  //   const allProgramas = await this.programaService.findAll();

  //   // Filtrar los programas que no están asignados al usuario
  //   const programasNoAsignados = allProgramas.filter(
  //     (programa) =>
  //       !user.programa.some((userPrograma) => userPrograma.ID === programa.ID),
  //   );

  //   return programasNoAsignados;
  // }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['programa'],
    });
  }
  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }
  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    console.log('datos que llegan al service', updateUsuarioDto);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('Usuario no encontrado'); // Manejo de errores
    }
    console.log(
      'datos que llegan:',
      updateUsuarioDto.name,
      updateUsuarioDto.email,
      updateUsuarioDto.telefono,
      updateUsuarioDto.cedula,
      'id:',
      id,
    );

    // Actualizar el usuario con los nuevos datos
    const data = Object.assign(user, updateUsuarioDto);
    console.log(data); // Asigna laso propiedades del DTO al usuari0

    return await this.userRepository.save(data); // Guarda el usuario actualizado
  }

  async remove(id: number) {
    console.log('lo que llega del front', id);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('Usuario no encontrado'); // Manejo de errores
    }

    return await this.userRepository.remove(user); // Elimina el usuario
  }
}
