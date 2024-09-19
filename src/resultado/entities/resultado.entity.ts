/* eslint-disable prettier/prettier */
import { Competencia } from 'src/competencia/entities/competencia.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Resultado {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ length: 20, unique: true })
  Codigo: string;

  @Column({ length: 80 })
  Nombre: string;

  @Column({ length: 100 })
  Descripcion: string;

  @ManyToOne(() => Competencia, competencia => competencia.resultados)
  @JoinColumn({ name: 'id_competencia' })
  competencia: Competencia;
}
