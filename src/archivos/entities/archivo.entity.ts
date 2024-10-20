/* eslint-disable prettier/prettier */
import { Resultado } from 'src/resultado/entities/resultado.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Archivo {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ length: 20, unique: true, type: 'varchar' })
  Codigo: string;

  @Column({ length: 80 })
  Nombre: string;

  @Column()
  Tamaño: string;

  @Column()
  Link: string;

  @Column({ length: 100 })
  public_id: string

  @ManyToOne(() => Resultado, (resultado) => resultado.archivos)
  @JoinColumn({ name: 'id_resultado' })
  resultado: Resultado;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
