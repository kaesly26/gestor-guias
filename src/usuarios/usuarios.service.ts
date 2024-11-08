import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { In, Like, Repository } from 'typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/role-guard/role-guard.guard';
import { Roles } from 'src/roles/decorator/role.decorator';
import * as bcryptjs from 'bcryptjs';
import { Competencia } from 'src/competencia/entities/competencia.entity';
import { Programa } from 'src/programa/entities/programa.entity';

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
  ): Promise<{ usuario: Usuario; mensaje: string }> {
    const usuario = await this.userRepository.findOne({
      where: { id: usuarioId },
      relations: ['competencias'],
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado.');
    }

    // Filtrar las competencias ya asignadas
    const competenciasActualesIds = usuario.competencias.map((c) => c.ID);
    const nuevasCompetenciasIds = competenciasIds.filter(
      (id) => !competenciasActualesIds.includes(id),
    );

    if (!nuevasCompetenciasIds.length) {
      return {
        usuario,
        mensaje: 'Todas las competencias seleccionadas ya están asignadas.',
      };
    }

    // Obtener las nuevas competencias desde el repositorio
    const nuevasCompetencias = await this.competenciaRepository.findByIds(
      nuevasCompetenciasIds,
    );

    if (!nuevasCompetencias.length) {
      throw new Error('No se encontraron competencias nuevas para asignar.');
    }

    // Agregar solo las nuevas competencias
    usuario.competencias.push(...nuevasCompetencias);
    await this.userRepository.save(usuario);

    const mensaje =
      nuevasCompetenciasIds.length < competenciasIds.length
        ? 'Algunas competencias ya estaban asignadas y no se duplicaron.'
        : 'Competencias asignadas con éxito.';

    return { usuario, mensaje };
  }

  async findAll(authenticatedUser: Usuario, programaNombre?: string) {
    console.log('usuario', authenticatedUser);
    const userRole = authenticatedUser.role.rol_name;
    console.log('el usuario', userRole);

    let users = [];

    // Si se proporciona un nombre de programa, buscar usuarios cuyas competencias estén asociadas a ese programa
    if (programaNombre) {
      users = await this.userRepository.find({
        where: {
          competencias: {
            programas: {
              Nombre: Like(`%${programaNombre}%`),
            },
          },
          role:
            userRole === 'Admin'
              ? { rol_name: In(['Coordinador', 'Admin']) }
              : { rol_name: 'Instructor' },
        },
        relations: ['competencias', 'competencias.programas', 'role'],
        select: ['id', 'name', 'email', 'cedula', 'telefono'],
      });
    } else {
      // Si no se proporciona nombre de programa, realizar la búsqueda por rol
      users = await this.userRepository.find({
        where: {
          role:
            userRole === 'Admin'
              ? { rol_name: In(['Coordinador', 'Admin']) }
              : { rol_name: 'Instructor' },
        },
        relations: ['competencias', 'competencias.programas', 'role'],
        select: ['id', 'name', 'email', 'cedula', 'telefono'],
      });
    }

    console.log('Usuarios encontrados:', users);
    return users;
  }

  async obtenerProgramasDeCompetenciasDeUsuario(
    usuarioId: number,
  ): Promise<{ usuario: Usuario; programas: Programa[] }> {
    // Buscar el usuario junto con sus competencias
    const usuario = await this.userRepository.findOne({
      where: { id: usuarioId },
      relations: ['competencias', 'competencias.programas'],
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado.');
    }

    // Extraer todos los programas únicos de las competencias del usuario
    const programas = usuario.competencias
      .flatMap((competencia) => competencia.programas)
      .filter(
        (programa, index, self) =>
          index === self.findIndex((p) => p.ID === programa.ID),
      );

    return { usuario, programas };
  }

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
      throw new Error('Usuario no encontrado');
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

    const data = Object.assign(user, updateUsuarioDto);
    console.log(data);

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

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user);
  }
}
