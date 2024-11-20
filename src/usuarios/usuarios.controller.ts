import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/role-guard/role-guard.guard';
import { Roles } from 'src/roles/decorator/role.decorator';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Programa } from 'src/programa/entities/programa.entity';
import { Usuario } from './entities/usuario.entity';
import { Request } from 'express';

@Controller('usuarios')
@UseGuards(AuthGuard, RolesGuard)
export class UsuariosController {
  constructor(private readonly userService: UsuariosService) {}

  @Post()
  @Roles('Admin')
  create(@Body() createUserDto: CreateUsuarioDto) {
    console.log('aqui en usuario controller', createUserDto);
    return this.userService.create(createUserDto);
  }
  //agregar competencias a usuarios
  @Post(':id/competencias')
  @Roles('Admin', 'Coordinador')
  async agregarCompetencias(
    @Param('id') id: number,
    @Body('competenciasIds') competenciasIds: number[],
  ) {
    const resultado = await this.userService.agregarCompetenciasAUsuario(
      id,
      competenciasIds,
    );
    return {
      usuario: resultado.usuario,
      mensaje: resultado.mensaje,
    };
  }
  @Delete(':usuarioId/competencias/:competenciaId')
  @Roles('Admin', 'Coordinador')
  async eliminarCompetencia(
    @Param('usuarioId') usuarioId: number,
    @Param('competenciaId') competenciaId: number,
  ): Promise<{ message: string }> {
    await this.userService.eliminarCompetencia(usuarioId, competenciaId);
    return {
      message: `Competencia con ID ${competenciaId} eliminada del usuario ${usuarioId}.`,
    };
  }

  @Get()
  @Roles('Admin', 'Coordinador')
  findAll(
    @Req() request: Request,
    @Query('programaNombre') programaNombre?: string,
  ) {
    const authenticatedUser = request.user;
    console.log('usuario que ingresa', authenticatedUser);
    return this.userService.findAll(authenticatedUser, programaNombre);
  }

  @Get(':id')
  @Roles('Admin', 'Instructor')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get(':usuarioId/programas')
  @Roles('Admin')
  async obtenerProgramasDeCompetenciasDeUsuario(
    @Param('usuarioId') usuarioId: number,
  ): Promise<{ usuario: Usuario; programas: Programa[] }> {
    return this.userService.obtenerProgramasDeCompetenciasDeUsuario(usuarioId);
  }

  @Patch(':id')
  @Roles('Admin')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    console.log('Cuerpo de la solicitud:', updateUsuarioDto);
    return this.userService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
