/* eslint-disable prettier/prettier */
import { Competencia } from 'src/competencia/entities/competencia.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';

@Entity()
export class Programa {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ length: 20, unique: true })
  Codigo: string;

  @Column({ length: 80 })
  Nombre: string; 

  @Column({ length: 100 })
  Descripcion: string;

  @OneToMany(() => Competencia, (competencia) => competencia.programa)
  competencias: Competencia[];
}

