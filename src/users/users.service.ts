import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUserProfile(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUserProfile(
    userId: string,
    updateData: {
      email?: string;
      currentPassword?: string;
      newPassword?: string;
    },
  ): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email is already taken
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.userModel.findOne({
        email: updateData.email,
      });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
      user.email = updateData.email;
    }

    // Update password if provided
    if (updateData.newPassword) {
      if (!updateData.currentPassword) {
        throw new UnauthorizedException('Current password is required');
      }

      const isPasswordValid = await bcrypt.compare(
        updateData.currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      user.password = await bcrypt.hash(updateData.newPassword, 10);
    }

    await user.save();
    return this.userModel.findById(userId).select('-password');
  }

  async deleteUser(userId: string, currentPassword: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect');
    }

    await this.userModel.findByIdAndDelete(userId);
  }
}
