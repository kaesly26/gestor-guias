/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { RolesModule } from 'src/roles/roles.module';
import { ProgramaModule } from 'src/programa/programa.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    UsuariosModule,
    RolesModule,
    ProgramaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
