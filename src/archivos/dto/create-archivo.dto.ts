/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty , IsNumber} from 'class-validator';
export class CreateArchivoDto {
  @IsNotEmpty()
  @IsString()
  Codigo: string;

  @IsNotEmpty()
  @IsString()
  Nombre: string;
  @IsNotEmpty()
  Fecha_Creacion: Date;

  @IsNotEmpty()
  @IsString()
  Tamaño: string;

  @IsNotEmpty()
  @IsString()
  Link: string;

  @IsNotEmpty()
  @IsNumber()
  id_resultado: number;
}
