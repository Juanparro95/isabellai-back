import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import appConfig from '@/config/app.config';
import { envValidationSchema } from '@/config/env.validation';
import { databaseConfig } from '@/config/database.config';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    UsersModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
