import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

import { isValidObjectId, Types } from 'mongoose';

@Injectable()
export class ValidateMongoId implements PipeTransform<string> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: string, metadata: ArgumentMetadata): string {
    if (isValidObjectId(value)) {
      if (String(new Types.ObjectId(value)) === value) {
        return value;
      }
      throw new BadRequestException('invalid note id');
    }
    throw new BadRequestException('invalid note id');
  }
}
