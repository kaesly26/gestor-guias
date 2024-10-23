import * as bcryptjs from 'bcryptjs';
import { BadRequestException, Injectable } from '@nestjs/common';

import { RegisterAuthDto } from './dto/register.dto';
import { LoginAuthDto } from './dto/login.dto';
import { RolesService } from 'src/roles/roles.service';
import { ProgramaService } from 'src/programa/programa.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuariosService,
    private readonly rolesService: RolesService,
    private readonly programaService: ProgramaService,
    private readonly JwtService: JwtService,
  ) {}
  async register(registerAuthDto: RegisterAuthDto) {
    console.log('estoy en auth service');
    const user = await this.usuarioService.findByEmail(registerAuthDto.email);
    if (user) {
      throw new BadRequestException('Email already exists');
    }
    const role = await this.rolesService.findOne(registerAuthDto.role);
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    const hashedPassword = await bcryptjs.hash(registerAuthDto.password, 10);
    console.log('la contraseña que se hasea en service:', hashedPassword);

    return await this.usuarioService.create({
      ...registerAuthDto,
      password: hashedPassword,
    });
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.usuarioService.findByEmail(loginAuthDto.email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const isPasswordValid = await bcryptjs.compare(
      loginAuthDto.password.trim(),
      user.password,
    );

    console.log(
      'password in DB',
      user.password,
      'and password provided: ',
      loginAuthDto.password,
      'comparacion:',
      isPasswordValid,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Incorrect password');
    }

    const payload = {
      id: user.id,
      email: user.email,
      rol: user.role.rol_name,
    };
    const token = await this.JwtService.signAsync(payload);
    if (!token) {
      throw new BadRequestException('Invalid credentials');
    }
    return {
      access_token: token,
      rol: payload.rol,
      id: payload.id,
    };
  }
}
