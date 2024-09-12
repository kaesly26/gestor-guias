import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Programa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Codigo: string;

  @Column()
  Nombre: string;

  @Column()
  Descripcion: string;
}
