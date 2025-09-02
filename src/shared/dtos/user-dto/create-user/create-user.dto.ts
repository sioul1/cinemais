import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto as CreateUserSchemaDto } from './create-user.schema';

export class CreateUserDto implements CreateUserSchemaDto {
  @ApiProperty({ example: 'João Silva' })
  name: string;
}
