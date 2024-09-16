/* eslint-disable prettier/prettier */
import { Programa } from 'src/programa/entities/programa.entity';
import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';

@Entity()
export class Competencia {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ length: 20, unique: true })
  Codigo: string;

  @Column({ length: 80 })
  Nombre: string;

  @Column({ length: 100 })
  Descripcion: string;

  @Column({
    type: 'enum',
    enum: ['Trasversal', 'Tecnica'],
    default: 'Trasversal',
  })
  Tipo: string;

  @ManyToOne(() => Programa, (programa) => programa.competencias)
  @JoinColumn({ name: 'id_programa' })
  programa: Programa;
}
