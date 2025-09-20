import { Module } from '@nestjs/common';
import { TodoService } from './todos.service';
import { TodosController } from './todos.controller';

@Module({
  controllers: [TodosController],
  providers: [TodoService],
})
export class TodosModule {}
