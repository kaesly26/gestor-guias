/* eslint-disable prettier/prettier */
import {
  IsInt,
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

  @IsNotEmpty()
  @IsInt()
  ID_programa: number;

  @IsEnum(TraversalType)
  Tipo: TraversalType;
}
