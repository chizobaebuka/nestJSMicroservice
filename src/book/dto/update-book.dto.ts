import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from 'src/schemas/book.schema';

export class UpdateBookDTO {
  @IsOptional()
  @IsString({ message: 'the title must be a string' })
  readonly title: string;

  @IsOptional()
  @IsString({ message: 'the author must be a string' })
  readonly author: string;

  @IsOptional()
  @IsString({ message: 'the description must be a string' })
  readonly description: string;

  @IsOptional()
  @IsNumber({}, { message: 'the price must be a number' })
  readonly price: number;

  @IsOptional()
  @IsEnum(Category, { message: 'please enter a valid category' })
  readonly category: Category;
}
