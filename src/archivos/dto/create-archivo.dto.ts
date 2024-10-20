/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsInt, IsOptional, Length } from 'class-validator';
export class CreateArchivoDto {
  @IsNotEmpty()
  @IsString()
  Codigo: string;

  @IsNotEmpty()
  @IsString()
  Nombre: string;

  @IsNotEmpty()
  @IsString()
  Tamaño: string;

  @IsNotEmpty()
  @IsString()
  Link?: string;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  public_id?: string;

  @IsNotEmpty()
  @IsInt()
  id_resultado: number;
}
