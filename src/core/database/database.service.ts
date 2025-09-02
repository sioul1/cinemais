/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    (BigInt.prototype as any).toJSON = function () {
      return this.toString();
    };
  }
}
