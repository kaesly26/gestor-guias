import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesModule } from 'src/roles/roles.module';
import { ProgramaModule } from 'src/programa/programa.module';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]), RolesModule, ProgramaModule],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
