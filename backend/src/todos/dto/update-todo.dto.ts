import { IsString, IsOptional, IsEnum, IsDateString, IsUUID, MaxLength } from 'class-validator';
import { TodoStatus } from '../entities/todo.entity';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;
  
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsDateString()
  @IsOptional()
  dueAt?: string;
}
