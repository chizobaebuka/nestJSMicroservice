import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from 'src/schemas/book.schema';

export class CreateBookDTO {
  @IsString({ message: 'the title must be a string' })
  @IsNotEmpty({ message: 'the title must not be empty' })
  readonly title: string;

  @IsString({ message: 'the title must be a string' })
  @IsNotEmpty({ message: 'the title must not be empty' })
  readonly description: string;

  @IsString({ message: 'the title must be a string' })
  @IsNotEmpty({ message: 'the title must not be empty' })
  readonly author: string;

  @IsNumber({}, { message: 'the price must be a number' })
  @IsNotEmpty({ message: 'the title must not be empty' })
  readonly price: number;

  @IsEnum(Category, { message: 'please enter a valid category' })
  @IsNotEmpty({ message: 'the title must not be empty' })
  readonly category: Category;
}
