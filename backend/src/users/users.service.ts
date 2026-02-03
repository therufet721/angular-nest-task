import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(login: string, hashedPassword: string): Promise<UserDocument> {
    const user = new this.userModel({ login, password: hashedPassword });
    return user.save();
  }

  async findByLogin(login: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ login }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }
}
