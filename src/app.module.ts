import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { TodosController } from './todos/todos.controller';
import { AuthService } from './auth/auth.service';
import { TodoService } from './todos/todos.service';
import { User, UserSchema } from './schemas/user.schema';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { SessionGuard } from './guards/session.guard';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/todoapp'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Todo.name, schema: TodoSchema },
    ]),
  ],
  controllers: [AppController, AuthController, TodosController],
  providers: [AuthService, TodoService, SessionGuard],
})
export class AppModule {}
