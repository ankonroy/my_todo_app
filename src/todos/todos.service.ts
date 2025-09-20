import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from '../schemas/todo.schema';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  async getUserTodos(userId: string): Promise<Todo[]> {
    return this.todoModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async createTodo(
    userId: string,
    title: string,
    description: string,
  ): Promise<Todo> {
    const todo = new this.todoModel({ userId, title, description });
    return todo.save();
  }

  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo | null> {
    return this.todoModel.findByIdAndUpdate(id, updates, { new: true }).exec();
  }

  async deleteTodo(id: string): Promise<void> {
    await this.todoModel.findByIdAndDelete(id).exec();
  }
}
