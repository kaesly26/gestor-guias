/* eslint-disable prettier/prettier */
import {
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreateProgramaDto {
  @IsNotEmpty()
  @IsString()
  Codigo: string;

  @IsNotEmpty()
  @IsString()
  Nombre: string;

  @IsNotEmpty()
  @IsOptional()
  Descripcion: string;
}
