import { Module } from '@nestjs/common';
import { fileUploadController } from './fileUpload.controller';
import { fileUploadService } from './fileUpload.service';
import { UserSchema } from '../users/entities/user.entity';
import { RoleSchema } from '../roles/entities/role.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreModule } from '../core/core.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),
    UsersModule,
    CoreModule,
  ],
  exports: [],
  controllers: [fileUploadController],
  providers: [fileUploadService, UsersService],
})
export class fileUploadmodule {}
