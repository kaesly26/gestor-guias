/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, } from 'typeorm';

@Entity()
export class Programa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  Codigo: string;

  @Column({ length: 80 })
  Nombre: string;

  @Column({ length: 100 })
  Descripcion: string;
}
