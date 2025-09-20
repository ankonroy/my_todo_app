import { Controller, Get, Render, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { SessionGuard } from './guards/session.guard';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    return { message: 'Hello world!' };
  }

  @Get('login')
  @Render('login')
  loginPage(@Req() req: Request) {
    return { user: req.session.user, error: null };
  }

  @Get('register')
  @Render('register')
  registerPage(@Req() req: Request) {
    return { user: req.session.user, error: null };
  }

  @UseGuards(SessionGuard)
  @Get('todos')
  @Render('todos')
  todosPage(@Req() req: Request) {
    return { user: req.session.user };
  }

  @UseGuards(SessionGuard)
  @Get('user')
  @Render('user')
  userPage(@Req() req: Request) {
    return {
      user: req.session.user,
      stats: {
        totalTodos: 12,
        completedTodos: 8,
        pendingTodos: 4,
      },
    };
  }
}
