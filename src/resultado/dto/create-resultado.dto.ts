/* eslint-disable prettier/prettier */
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateResultadoDto {
  @IsNotEmpty()
  @IsString()
  Codigo: string;

  @IsNotEmpty()
  @IsString()
  Nombre: string;

  @IsNotEmpty()
  @IsOptional()
  Descripcion: string;

  @IsNotEmpty()
  @IsNumber()
  id_competencia: number;
}
