import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './database/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { DBService } from './database/service/db.service';
import { JwtTokenService } from './services/jwt.service';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', async function (next) {
            try {
              const salt = await bcrypt.genSalt(
                Number(process.env.SALT_ROUNDS),
              );
              const hash = await bcrypt.hash(this.password, salt);
              this.password = hash;
              return next();
            } catch (error) {
              next(error);
            }
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, DBService, JwtTokenService],
})
export class UsersModule {}
