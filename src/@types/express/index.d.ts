import { Usuario } from '../../usuarios/entities/usuario.entity';

declare module 'express' {
  export interface Request {
    user?: Usuario; // Extiende el tipo Request para incluir la propiedad user
  }
}
