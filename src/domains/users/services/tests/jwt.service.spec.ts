import { Test, TestingModule } from '@nestjs/testing';
import { JwtTokenService } from '../jwt.service';
import { verify } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

describe('JwtTokenService', () => {
  let service: JwtTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtTokenService],
    }).compile();

    service = module.get<JwtTokenService>(JwtTokenService);
  });

  it('should generate a token', async () => {
    const payload = {
      id: 'string',
      username: 'string',
    };
    //Generate a new token
    const token = await service.generateIdToken(payload, '1h');
    //Get the payload from the token
    const returnedPayload = verify(token, process.env.JWT_SECRET);
    expect(returnedPayload).toMatchObject(payload);
  });
});
