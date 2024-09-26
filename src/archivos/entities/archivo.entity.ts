/* eslint-disable prettier/prettier */
import { Resultado } from 'src/resultado/entities/resultado.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Archivo {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ length: 20, unique: true })
  Codigo: string;

  @Column({ length: 80 })
  Nombre: string;

  @CreateDateColumn({ type: 'timestamp' })
  Fecha_Creacion: Date;

  @Column()
  Tamaño: string;

  @Column()
  Link: string;

  @ManyToOne(() => Resultado, (resultado) => resultado.archivos)
  @JoinColumn({ name: 'id_resultado' })
  resultado: Resultado;
}
