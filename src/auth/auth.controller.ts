import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

import { RegisterAuthDto } from './dto/register.dto';
import { LoginAuthDto } from './dto/login.dto';
//import { AuthGuard } from './auth.guard';
import { RolesGuard } from 'src/roles/role-guard/role-guard.guard';
import { Roles } from 'src/roles/decorator/role.decorator';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuariosService,
  ) {}

  @Post('register')
  @UseGuards(RolesGuard)
  @Roles('Admin')
  Register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @Post('login')
  Login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }
  @Post('restablecer-clave')
  async requestPasswordReset(@Body('email') email: string) {
    await this.authService.sendPasswordReset(email);
    return { message: 'Enlace de restablecimiento de contraseña enviado' };
  }

  @Post('actualizar-clave')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    try {
      console.log('token', token);
      const userId = await this.authService.verifyPasswordResetToken(token);
      console.log('userId', userId, 'new pass', newPassword);
      if (!userId) {
        return { message: 'Token no válido o caducado' };
      }

      await this.usuarioService.updatePassword(Number(userId), newPassword);
      return { message: 'Contraseña actualizada' };
    } catch (error) {
      return { message: 'Token no válido o caducado' };
    }
  }
}
