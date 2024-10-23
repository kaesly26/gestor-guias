import { Injectable, UseGuards } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/role-guard/role-guard.guard';
import { Roles } from 'src/roles/decorator/role.decorator';
import { ProgramaService } from 'src/programa/programa.service';
import * as bcryptjs from 'bcryptjs';

@UseGuards(AuthGuard, RolesGuard)
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private userRepository: Repository<Usuario>,
    private readonly programaService: ProgramaService,
  ) {}

  @Roles('admin')
  async create(createUserDto: CreateUsuarioDto) {
    const salt = await bcryptjs.genSalt(10); // Genera un salt
    const password = await bcryptjs.hash(createUserDto.password, salt); // Encripta la contraseña

    createUserDto.password = password;
    console.log('la contraseña que se envia desde usuarioservice:', password);
    // Crear el usuario con la contraseña encriptada

    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  @Roles('admin')
  async findAll() {
    const users = await this.userRepository.find({
      relations: ['programa', 'role'],
      select: ['id', 'name', 'email', 'cedula', 'telefono'],
    });
    return users;
  }

  async findProgramasAsignados(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['programa'],
    });
    return user.programa;
  }
  async findProgramasNoAsignados(id: number) {
    // Obtener el usuario con los programas asignados
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['programa'],
    });

    // Obtener todos los programas
    const allProgramas = await this.programaService.findAll();

    // Filtrar los programas que no están asignados al usuario
    const programasNoAsignados = allProgramas.filter(
      (programa) =>
        !user.programa.some((userPrograma) => userPrograma.ID === programa.ID),
    );

    return programasNoAsignados;
  }

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
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('Usuario no encontrado'); // Manejo de errores
    }

    // Actualizar el usuario con los nuevos datos
    Object.assign(user, updateUsuarioDto); // Asigna las propiedades del DTO al usuario

    return await this.userRepository.save(user); // Guarda el usuario actualizado
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
