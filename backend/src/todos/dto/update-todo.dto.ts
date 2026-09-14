import { IsString, IsOptional, IsIn, IsDateString } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  title?: string;

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
