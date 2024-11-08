/* eslint-disable prettier/prettier */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/role.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtener los roles requeridos desde el decorador
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      console.warn('Roles requeridos no definidos');
      return false;
    }

    console.log('roles requeridos:',requiredRoles);
    // Si no se especificaron roles, permite el acceso
    if (!requiredRoles) {
      return true;
    }
    try {
      // Obtener la solicitud y el token del header
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization?.split(' ')[1];
      console.log('token del header:', token);
      // Verificar si el token no existe
      if (!token) {
        throw new UnauthorizedException('No se proporcionaron credenciales');
      }
      // Verificar el token de manera asíncrona para obtener el usuario
      const user = await this.jwtService.verifyAsync(token);
      console.log('usuario del header',user);
      console.log('roles que existen', requiredRoles);
      // Verificar si el usuario tiene alguno de los roles requeridos
      const userRole = user.role.rol_name;
      const hasRole = requiredRoles.some((roles) => userRole === roles);
      console.log('el usuario tiene alguno de los roles requeridos',hasRole,'rol del usuario', userRole);

      if (!hasRole) {
        throw new ForbiddenException('No tienes acceso a este recurso.');
      }
      return true;
    } catch (error) {
      // Manejo de errores como token expirado o inválido
      if (error.name === 'Error de token caducado') {
        throw new UnauthorizedException('El token ha caducado');
      } else if (error.name === 'Error de JsonWebToken') {
        throw new UnauthorizedException('Token no válido');
      }

      throw error;
    }
  }
}
