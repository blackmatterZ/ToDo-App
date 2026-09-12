import { IsNotEmpty, IsString, Length, IsOptional, IsBoolean } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
