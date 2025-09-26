import { Controller, Post, Body, Req, Res, Render, Get } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.validateUser(
        body.email,
        body.password,
      );
      if (user) {
        req.session.user = user;
        return res.redirect('/todos');
      } else {
        // return res.render('login', {
        //   error: 'Invalid credentials',
        //   user: null,
        // });
        // console.log("Invalid credentials");
        return res.status(400).json({
          error: 'Invalid credentials',
          user: null,
        });
      }
    } catch (error) {
      //   return res.render('login', {
      //     error: 'An error occurred during login',
      //     user: null,
      //   });
      //   console.log('accidental error');
      return res.status(400).json({
        error: 'An error occurred during login',
        user: null,
      });
    }
  }

  @Post('register')
  async register(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    try {
      // Check if passwords match
      //   if (body.password !== body.confirmPassword) {
      //       console.log("register user");
      //     return res.render('register', {
      //       error: 'Passwords do not match',
      //       user: null,
      //     });
      //   }

      // Register the user
      await this.authService.register(body.email, body.password);
      return res.redirect('/login');
    } catch (error) {
      return res.render('register', {
        error: 'Registration failed. Email may already be in use.',
        user: null,
      });
    }
  }
}
