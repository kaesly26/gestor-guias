/* eslint-disable prettier/prettier */
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';


export enum TraversalType {
  Trasversal = 'Trasversal',
  Tecnica = 'Tecnica',
}

export class CreateCompetenciaDto {
  @IsNotEmpty()
  @IsString()
  Codigo: string;

  @IsNotEmpty()
  @IsString()
  Nombre: string;

  @IsNotEmpty()
  @IsOptional()
  Descripcion: string;

  @IsEnum(TraversalType)
  Tipo: TraversalType;

}
