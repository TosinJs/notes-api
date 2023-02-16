import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 50, {
    message: 'Username should be at least 4 characters long',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 50, {
    message: 'Password should be at least 5 characters long',
  })
  password: string;
}
