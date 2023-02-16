import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtTokenService {
  generateIdToken(payload: tokenPayload, expiryTime: string): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: expiryTime,
          issuer: 'RilHomie',
        },
        (err, token) => {
          if (err) reject(err);
          resolve(token);
        },
      );
    });
  }
}
