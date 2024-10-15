/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty , IsNumber, IsOptional} from 'class-validator';
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

  @IsOptional()
  @IsString()
  Link?: string;

  @IsNotEmpty()
  @IsNumber()
  id_resultado: number;
}
