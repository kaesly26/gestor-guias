/* eslint-disable prettier/prettier */
import { Programa } from 'src/programa/entities/programa.entity';
import { Resultado } from 'src/resultado/entities/resultado.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';

@Entity()
export class Competencia {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ length: 20, unique: true })
  Codigo: string;

  @Column({ length: 80 })
  Nombre: string;

  @Column({ length: 225 })
  Descripcion: string;

  @Column({
    type: 'enum',
    enum: ['Trasversal', 'Tecnica'],
    default: 'Trasversal',
  })
  Tipo: string;

  @ManyToMany(() => Programa, (programa) => programa.competencias)
  programas: Programa[];

  @OneToMany(() => Resultado, (resultado) => resultado.competencia)
  resultados: Resultado[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToMany(() => Usuario, (user) => user.competencias)
  @JoinTable()
  usuario: Usuario;
}
