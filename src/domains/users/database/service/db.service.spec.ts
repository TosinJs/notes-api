import { Test, TestingModule } from '@nestjs/testing';
import { DBService } from './db.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import * as dotenv from 'dotenv';
import { Connection, Model, connect } from 'mongoose';
dotenv.config();

describe('DBService', () => {
  jest.setTimeout(600 * 1000);

  let dbService: DBService;
  let mongoConnection: Connection;
  let userModel: Model<User>;

  const user = { username: 'username', password: 'password' };

  beforeAll(async () => {
    mongoConnection = (await connect(process.env.MONGO_URI)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DBService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
      ],
    }).compile();

    dbService = module.get<DBService>(DBService);
  });

  afterEach(async () => {
    if (userModel) await userModel.deleteMany({});
  });

  afterAll(async () => {
    if (mongoConnection) await mongoConnection.close();
  });

  it('should be defined', async () => {
    expect(dbService).toBeDefined();
  });

  describe('Create User', () => {
    it('should create a new user', async () => {
      const newUser = await dbService.createUser(user);
      expect(newUser).toMatchObject({ ...user, _id: expect.any(String) });
    });

    it('should throw a duplicate error', async () => {
      await dbService.createUser(user);
      expect(dbService.createUser(user)).toThrow();
    });
  });
});
