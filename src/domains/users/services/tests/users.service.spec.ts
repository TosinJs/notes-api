import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { DBService } from '../../database/service/db.service';
import { JwtTokenService } from '../jwt.service';
import { mongo } from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let jwtTokenService: JwtTokenService;
  let dbService: DBService;

  const user = {
    username: 'username',
    password: 'password',
  };

  const savedUser = {
    _id: new mongo.ObjectId(),
    password: user.password,
    username: user.username,
    comparePassword: () => true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DBService,
          useFactory: () => ({
            createUser: jest.fn().mockImplementation(async () => savedUser),
            findByUsername: jest.fn(async () => savedUser),
          }),
        },
        {
          provide: JwtTokenService,
          useFactory: () => ({
            generateIdToken: jest.fn(() => 'token'),
          }),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jwtTokenService = module.get<JwtTokenService>(JwtTokenService);
    dbService = module.get<DBService>(DBService);
  });

  describe('create a new user', () => {
    it('should create a new user', async () => {
      const token = await service.create(user);
      expect(dbService.createUser).toBeCalledWith(user);
      expect(jwtTokenService.generateIdToken).toBeCalledWith(
        {
          id: savedUser._id.toString(),
          username: user.username,
        },
        '24h',
      );
      expect(token).toEqual('token');
    });
  });

  describe('login user', () => {
    it('should login the user', async () => {
      const token = await service.login(user);
      expect(dbService.findByUsername).toBeCalledWith(user.username);
      expect(jwtTokenService.generateIdToken).toBeCalledWith(
        {
          id: savedUser._id.toString(),
          username: user.username,
        },
        '24h',
      );
      expect(token).toEqual('token');
    });
  });
});
