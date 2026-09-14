import { IsString, IsOptional, IsIn, IsDateString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  @IsIn(['Pending', 'Completed'])
  status?: string;
  
  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsDateString()
  @IsOptional()
  dueAt?: string;
}
