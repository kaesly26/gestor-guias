import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramaModule } from './programa/programa.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'nuevaconexion',
      database: 'gestor_guias',
      entities: [],
      synchronize: true,
    }),
    ProgramaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
