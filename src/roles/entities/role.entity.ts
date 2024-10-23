import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80 })
  rol_name: string;

  @OneToMany(() => Usuario, (usuario) => usuario.role)
  usuario: Usuario[];
}
