import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DBService } from '../database/service/db.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/update-user.dto';
import { JwtTokenService } from './jwt.service';
import {
  ConfilctError,
  InternalServerError,
} from '../../../utils/error-response.utils';

@Injectable()
export class UsersService {
  constructor(
    private dbService: DBService,
    private jwtService: JwtTokenService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.dbService.createUser(createUserDto);
      return this.jwtService.generateIdToken(
        { id: user._id.toString(), username: user.username },
        '24h',
      );
    } catch (error) {
      if (error.message.includes('duplicate key')) {
        throw new ConfilctError(
          'duplicate entry - this username already exists',
          error,
        );
      } else throw new InternalServerError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.dbService.findByUsername(loginUserDto.username);
    if (!user) {
      throw new HttpException(
        'Invalid User Credentials',
        HttpStatus.BAD_REQUEST,
      );
    }
    const correctPassword = await user.comparePassword(loginUserDto.password);
    if (!correctPassword) {
      throw new HttpException(
        'Invalid User Credentials',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.jwtService.generateIdToken(
      { id: user._id.toString(), username: user.username },
      '24h',
    );
  }
}
