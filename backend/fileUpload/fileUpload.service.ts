import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as csv from 'csvtojson';
import { User, UserDocument } from '../users/entities/user.entity';
import { Role, RoleDocument } from '../roles/entities/role.entity';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { validation } from '../../validation/configCommon';
@Injectable()
export class fileUploadService {
  [x: string]: any;
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    private usersService: UsersService,
  ) {}
  async csvConverter(file: any) {
    csv()
      .fromFile('./assets/' + file.filename)
      .then((jsonObj) => {});
    const users = await csv().fromFile('./assets/' + file.filename);

    let err = [];
    try {
      let index = 0;
      for (let user of users) {
        const data = await this.userModel.findOne({ email: user.email });
        const newRole = await this.roleModel.findOne({
          roleName: user.roleName,
        });
        var regexMail = new RegExp(/^w+@[a-zA-Z_]+?.[a-zA-Z]{2,3}$/);
        var regex = new RegExp('^[a-zA-Z ]*$');

        const invalidMailId = {
          row: index + 1,
          column: 'email',
          message: 'invalid email id',
        };
        const invalidRoleName = {
          row: index + 1,
          column: 'roleName',
          message: 'invalid Role Name',
        };
        const invalidFirstName = {
          row: index + 1,
          column: 'firstName',
          message: 'Invalid First Name',
        };
        const invalidLastName = {
          row: index + 1,
          column: 'lastName',
          message: 'Invalid Last Name',
        };
        let isError = false;
        if (!regex.test(user.firstName)) {
          if (!err.includes(invalidFirstName)) {
            err.push(invalidFirstName);
            isError = true;
          }
        }
        if (!regex.test(user.lastName)) {
          if (!err.includes(invalidLastName)) {
            err.push(invalidLastName);
            isError = true;
          }
        }
        if (!newRole) {
          if (!err.includes(invalidRoleName)) {
            err.push(invalidRoleName);
            isError = true;
          }
        }
        if (!data && !isError) {
          console.log('No duplicate');
          user.roleId = newRole._id;
          const newUser = new this.userModel(user);
          console.log('Added user :' + newUser);
          await newUser.save();
        } else {
          // if (!err.includes(duplicateMailId)) {
          //   err.push(duplicateMailId);
          //   // isError = true;
          // }
          if (data && !isError) {
            console.log('updating');
            user.roleId = newRole._id;
            await this.usersService.update(data.id, user);
          }
        }
        console.log(err, 'checking dupes');
        index++;
      }
      return err;
    } catch (error) {
      console.log(error, 'insideError');
      throw new Error('Failed');
    }
  }
}
