import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Req,
  Render,
} from '@nestjs/common';
import { UserService } from './users.service';
import { SessionGuard } from '../guards/session.guard';
import { UseGuards } from '@nestjs/common';

@Controller('user')
@UseGuards(SessionGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Render('user')
  async getProfilePage(@Req() req: any) {
    const user = await this.userService.getUserProfile(req.session.user._id);
    return { user };
  }

  @Put('profile')
  async updateProfile(@Req() req: any, @Body() updateData: any) {
    // console.log(req.session.user._id);
    // const id = req.body.

    const user = await this.userService.updateUserProfile(
      req.session.user._id,
      updateData,
    );
    return { message: 'Profile updated', user };
  }

  @Delete()
  async deleteAccount(
    @Req() req: any,
    @Body() body: { currentPassword: string },
  ) {
    await this.userService.deleteUser(
      req.session.user._id,
      body.currentPassword,
    );
    return { message: 'Account deleted' };
  }
}
