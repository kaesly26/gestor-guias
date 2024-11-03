import * as bcryptjs from 'bcryptjs';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { RegisterAuthDto } from './dto/register.dto';
import { LoginAuthDto } from './dto/login.dto';
import { RolesService } from 'src/roles/roles.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuariosService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}
  async register(registerAuthDto: RegisterAuthDto) {
    console.log('la contraseña que se envie:', registerAuthDto.password);
    const user = await this.usuarioService.findByEmail(registerAuthDto.email);
    if (user) {
      throw new BadRequestException('Email already exists');
    }
    const role = await this.rolesService.findOne(registerAuthDto.role);
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    return await this.usuarioService.create(registerAuthDto);
  }

  //Inicio de sesion
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
    const token = await this.jwtService.signAsync(payload);
    if (!token) {
      throw new BadRequestException('Invalid credentials');
    }
    return {
      access_token: token,
      rol: payload.rol,
      id: payload.id,
    };
  }
  //enviar mensaje de recuperación de contraseña
  async sendPasswordReset(email: string): Promise<void> {
    const user = await this.usuarioService.findByEmail(email);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Genera un token de restablecimiento
    const token = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '1h' },
    );

    // Envía el token al correo electrónico del usuario
    const resetLink = `http://localhost:5173/auth/restablecer_clave?token=${token}`;
    await this.mailService.sendMail({
      to: email,
      subject: 'Solicitud de restablecimiento de contraseña',
      text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetLink}`,
    });
  }

  async verifyPasswordResetToken(token: string): Promise<string | null> {
    try {
      const payload = this.jwtService.verify(token);
      console.log(payload);
      return payload.userId;
    } catch (error) {
      return null;
    }
  }
}
