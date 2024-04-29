import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import mongoose, { Model } from 'mongoose';
import { Book, Category } from './schemas/book.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateBookDTO } from './dto/create-book.dto';
import { User } from '../../src/auth/schemas/user.schema';

describe('BookService', () => {
  let bookService: BookService;
  let model: Model<Book>;

  const mockBook = {
    _id: '662c131e18872a501700f246',
    user: '662bd256efbc3b07e051f298',
    title: 'Book8',
    description: 'Book 8 desc',
    author: 'Author 8',
    price: 560,
    category: Category.FANTASY,
  };

  const mockUser = {
    _id: '662bd256efbc3b07e051f298',
    email: 'user1@example.com',
    name: 'User 1',
  };

  const mockBookService = {
    findById: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookService,
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    model = module.get<Model<Book>>(getModelToken(Book.name));
  });

  describe('findById', () => {
    it('should return a book by ID', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockBook);
      const result = await bookService.findById(mockBook._id);
      expect(result).toEqual(mockBook);
      expect(model.findById).toHaveBeenCalledWith(mockBook._id);
    });

    it('should throw bad request exception if invalid id is provided', async () => {
      const id = 'invalid-id';

      const isValidObjectIdMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(bookService.findById(id)).rejects.toThrow(
        BadRequestException,
      );

      expect(isValidObjectIdMock).toHaveBeenCalledWith(id);
      isValidObjectIdMock.mockRestore();
    });

    it('should throw NotFoundException if book is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);
      await expect(bookService.findById(mockBook._id)).rejects.toThrow(
        NotFoundException,
      );

      expect(model.findById).toHaveBeenCalledWith(mockBook._id);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const query: any = { page: 1, keyword: 'Book' }; // Explicitly type query as any

      // Mock the behavior of the model's find method
      jest.spyOn(model, 'find').mockReturnValue({
        // Mock the behavior of the limit method
        limit: jest.fn().mockReturnValue({
          // Mock the behavior of the skip method
          skip: jest.fn().mockReturnValue([mockBook]),
        }),
      } as any);

      const result = await bookService.findAll(query);

      // Assertions
      expect(result).toEqual([mockBook]); // Check if the result matches the expected value
      expect(model.find).toHaveBeenCalledWith({
        title: { $regex: 'Book', $options: 'i' },
      }); // Check if model.find is called with the correct query
    });
  });

  describe('create', () => {
    it('should create and return a book', async () => {
      const newBook = {
        title: 'Book8',
        description: 'Book 8 desc',
        author: 'Author 8',
        price: 560,
        category: Category.FANTASY,
      };

      jest
        .spyOn(model, 'create')
        .mockImplementation(jest.fn().mockResolvedValue(mockBook));

      const result = await bookService.create(
        newBook as CreateBookDTO,
        mockUser as User,
      );

      expect(result).toEqual(mockBook);
    });
  });

  describe('updateById', () => {
    it('should update and return a book', async () => {
      const updatedBook = { ...mockBook, title: 'Updated Name of Book' };
      const book = { title: 'Updated Name of Book' };

      jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockImplementation(() => updatedBook as any);

      const result = await bookService.updateById(mockBook._id, book as any);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockBook._id, book);
      expect(result.title).toEqual(book.title);
    });
  });

  describe('deleteById', () => {
    it('should delete a book by id', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockBook);

      const result = await bookService.deleteById(mockBook._id);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockBook._id);
      expect(result).toEqual(mockBook);
    });
  });
});
