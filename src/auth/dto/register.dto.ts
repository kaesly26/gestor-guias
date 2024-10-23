import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterAuthDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  cedula: string;

  @IsNotEmpty()
  @IsString()
  telefono: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  password: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true }) // Valida que cada elemento sea un número
  programa?: number[];

  @IsNotEmpty()
  @IsNumber()
  role: number;
}
