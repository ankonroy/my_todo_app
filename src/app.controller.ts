import { Controller, Get, Render, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { SessionGuard } from './guards/session.guard';
import { RedirectIfAuthenticatedGuard } from './guards/redirectIfAuthenticated.guard';
import { TodoService } from './todos/todos.service';

@Controller()
export class AppController {
  constructor(private todoService: TodoService) {}
  @Get()
  @Render('index')
  root() {
    return { message: 'Hello world!' };
  }

  @UseGuards(RedirectIfAuthenticatedGuard)
  @Get('login')
  @Render('login')
  loginPage(@Req() req: Request) {
    return { user: req.session.user, error: null };
  }

  @UseGuards(RedirectIfAuthenticatedGuard)
  @Get('register')
  @Render('register')
  registerPage(@Req() req: Request) {
    return { user: req.session.user, error: null };
  }

  //   @Get('logout')
  //   logoutGet(@Req() req: Request, @Res() res: Response) {
  //     req.session.destroy((err) => {
  //       if (err) {
  //         console.error('Error destroying session:', err);
  //         return res.redirect('/todos');
  //       }
  //       res.clearCookie('connect.sid');
  //       res.redirect('/login');
  //     });
  //   }

  @UseGuards(SessionGuard)
  @Get('todos')
  @Render('todos')
  todosPage(@Req() req: Request) {
    return { user: req.session.user };
  }

  @UseGuards(SessionGuard)
  @Get('user')
  @Render('user')
  async userPage(@Req() req: Request) {
    const todos = await this.todoService.getUserTodos(req.session.user._id);
    const totalTodos = todos.length;
    const completedTodos = todos.filter((todo) => todo.completed).length;
    const pendingTodos = totalTodos - completedTodos;

    return {
      user: req.session.user,
      stats: {
        totalTodos,
        completedTodos,
        pendingTodos,
      },
    };
  }
}
