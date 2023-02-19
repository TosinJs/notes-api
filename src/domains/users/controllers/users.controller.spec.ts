import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { HttpStatus } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const user = {
    username: 'username',
    password: 'password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: () => ({
            create: jest.fn().mockImplementation(async () => 'token'),
            login: jest.fn().mockImplementation(async () => 'token'),
          }),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('create a new user', () => {
    it('should create a new user', async () => {
      const response = await controller.create(user);
      expect(service.create).toBeCalledWith({
        ...user,
      });
      expect(response).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'User Created',
        body: 'token',
      });
    });
  });

  describe('login a user', () => {
    it('should login the user in', async () => {
      const response = await controller.login(user);
      expect(service.login).toBeCalledWith({
        ...user,
      });
      expect(response).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Logged In',
        body: 'token',
      });
    });
  });
});
