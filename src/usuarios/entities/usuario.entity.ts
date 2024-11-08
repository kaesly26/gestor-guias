import { Competencia } from 'src/competencia/entities/competencia.entity';
import { Role } from 'src/roles/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80 })
  name: string;

  @Column({ length: 80, unique: true })
  email: string;

  @Column({ length: 11, unique: true })
  cedula: string;

  @Column({ length: 11, unique: true })
  telefono: string;

  @Column()
  password: string;

  @ManyToMany(() => Competencia, (competencia) => competencia.usuario)
  competencias: Competencia[];

  @ManyToOne(() => Role, (role) => role.usuarios)
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
