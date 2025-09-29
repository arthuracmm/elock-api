// modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: 'seuSegredoJWT',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], 
})
export class AuthModule {}
