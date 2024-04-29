import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

describe('BookService', () => {
  let authService: AuthService;
  let model: Model<User>;
  //   let jwtService: JwtService;

  const mockUser = {
    _id: '123',
    name: 'User 1',
    email: 'user@example.com',
  };

  const mockAuthService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    // jwtService = module.get<JwtService>(JwtService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', async () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    xit('should create and return the user', async () => {
      const signUpDto = {
        name: mockUser.name,
        email: mockUser.email,
        password: 'password',
      };

      jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashedPassword');
      //   jest
      //     .spyOn(model, 'create')
      //     .mockImplementationOnce(() => Promise.resolve(mockUser));
      model.create = jest.fn().mockResolvedValue(mockUser);
      const res = await authService.signUp(signUpDto);
      expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, 10);
      expect(model.create).toHaveBeenCalledWith({
        name: signUpDto.name,
        email: signUpDto.email,
        password: 'hashedPassword',
      });
      expect(res).toEqual({
        user: mockUser,
        token: 'token',
      });
    });
  });
});
