import { Module } from '@nestjs/common';
import { DatabaseModule } from './core/database/database.module';
import { MediaModule } from './feat/media/media.module';
import { UserModule } from './feat/users/users.module';

@Module({
  imports: [DatabaseModule, MediaModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
