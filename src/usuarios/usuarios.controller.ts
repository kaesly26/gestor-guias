import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

//import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/role-guard/role-guard.guard';
import { Roles } from 'src/roles/decorator/role.decorator';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
@UseGuards(RolesGuard)
export class UsuariosController {
  constructor(private readonly userService: UsuariosService) {}

  @Post()
  @Roles('Admin')
  create(@Body() createUserDto: CreateUsuarioDto) {
    console.log('aqui en usuario controller', createUserDto);
    return this.userService.create(createUserDto);
  }

  @Get()
  //@Roles('admin')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'Instructor')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get(':id/programas-asignados')
  @Roles('Admin', 'Instructor')
  findProgramasAsignados(@Param('id') id: string) {
    return this.userService.findProgramasAsignados(+id);
  }

  @Get(':id/programas-no-asignados')
  @Roles('Admin')
  findProgramasNoAsignados(@Param('id') id: string) {
    return this.userService.findProgramasNoAsignados(+id);
  }

  @Patch(':id')
  @Roles('Admin')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUsuarioDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
