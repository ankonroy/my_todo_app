import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { SessionGuard } from '../guards/session.guard';
import { TodoService } from './todos.service';

@Controller('api/todos')
@UseGuards(SessionGuard)
export class TodosController {
  constructor(private todoService: TodoService) {}

  @Get()
  async getTodos(@Req() req: Request) {
    const userId = req.session.user._id;
    return await this.todoService.getUserTodos(userId);
  }

  @Post()
  async createTodo(
    @Req() req: Request,
    @Body() body: { title: string; description: string },
  ) {
    const userId = req.session.user._id;
    return await this.todoService.createTodo(
      userId,
      body.title,
      body.description,
    );
  }

  @Put(':id')
  async updateTodo(
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string; completed?: boolean },
  ) {
    return await this.todoService.updateTodo(id, body);
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: string) {
    return await this.todoService.deleteTodo(id);
  }
}
