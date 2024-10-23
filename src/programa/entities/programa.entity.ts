/* eslint-disable prettier/prettier */
import { Competencia } from 'src/competencia/entities/competencia.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @ManyToMany(() => Competencia, (competencia) => competencia.programas)
  @JoinTable()
  competencias: Competencia[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToMany(() => Usuario, (user) => user.programa)
  @JoinTable()
  usuario: Usuario;
}
