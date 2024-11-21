/* eslint-disable prettier/prettier */
import { Archivo } from 'src/archivos/entities/archivo.entity';
import { Competencia } from 'src/competencia/entities/competencia.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Resultado {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ length: 20, unique: true })
  Codigo: string;

  @Column({ length: 80 })
  Nombre: string;

  @Column({ length: 225 })
  Descripcion: string;

  @ManyToOne(() => Competencia, (competencia) => competencia.resultados)
  @JoinColumn({ name: 'id_competencia' })
  competencia: Competencia;

  @OneToMany(() => Archivo, (archivo) => archivo.resultado)
  archivos: Archivo[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
