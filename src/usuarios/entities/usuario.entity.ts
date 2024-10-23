import { Programa } from 'src/programa/entities/programa.entity';
import { Role } from 'src/roles/entities/role.entity';
import {
  Column,
  Entity,
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

  @ManyToMany(() => Programa, (programa) => programa.usuario)
  programa: Programa[];

  @ManyToOne(() => Role, (role) => role.usuario)
  role: Role;
}
