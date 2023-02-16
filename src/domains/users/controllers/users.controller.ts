import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/update-user.dto';
import { UsersService } from '../services/users.service';
import { createSuccessResponse } from 'src/utils/response-builder.utils';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async create(@Body() createUserDto: CreateUserDto) {
    return createSuccessResponse(
      HttpStatus.CREATED,
      'User Created',
      await this.usersService.create(createUserDto),
    );
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return createSuccessResponse(
      HttpStatus.OK,
      'Logged In',
      await this.usersService.login(loginUserDto),
    );
  }
}
