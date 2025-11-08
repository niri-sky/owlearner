import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { randomBytes, createHash } from 'crypto';
import { Token } from '@prisma/client';
import * as CryptoJS from 'crypto-js';
import { TokenUpdateInput } from 'src/graphql/@generated/token/token-update.input';

@Injectable()
export class TokenService {
  constructor(private readonly databaseService: DatabaseService) {}

  hash(length: number) {
    const randomData = randomBytes(length);
    const timestamp = Date.now().toString();
    const combinedData = randomData.toString('hex') + timestamp;
    const hash = createHash('sha256');
    hash.update(combinedData);
    return hash.digest('hex');
  }

  async generate(data: string): Promise<string> {
    const uniqueHash = this.hash(32);
    const createToken = await this.databaseService.token.create({
      data: { data, token: uniqueHash },
    });
    return createToken.token;
  }
  async validate(token: string): Promise<string> {
    const findToken = await this.databaseService.token.findUnique({
      where: { token },
    });
    if (!findToken) throw new NotFoundException('Token not valid');
    return findToken.data;
  }
  async validateAndGet(token: string): Promise<Token> {
    const findToken = await this.databaseService.token.findUnique({
      where: { token },
    });
    if (!findToken) throw new NotFoundException('Token not valid');
    return findToken;
  }

  async delete(t: string): Promise<Token> {
    const token = await this.databaseService.token.delete({
      where: { token: t },
    });
    return token;
  }
  async update(t: string, input: TokenUpdateInput): Promise<Token> {
    const token = await this.databaseService.token.update({
      where: { token: t },
      data: input as any,
    });
    return token;
  }

  encrypt(data) {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      process.env.HASH_SECRET,
    ).toString();
  }

  decrypt(hash) {
    return JSON.parse(
      CryptoJS.AES.decrypt(hash, process.env.HASH_SECRET).toString(
        CryptoJS.enc.Utf8,
      ),
    );
  }

  generateUsername(name: string) {
    const cleanName = name
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/\s+/g, '')
      .toLowerCase();
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const username = cleanName + randomNumber;
    return username;
  }
}
