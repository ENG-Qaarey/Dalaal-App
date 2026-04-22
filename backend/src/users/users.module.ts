import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, JwtAuthGuard, RolesGuard],
  exports: [UsersService],
})
export class UsersModule {}
