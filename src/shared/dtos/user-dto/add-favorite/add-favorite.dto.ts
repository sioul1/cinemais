import { ApiProperty } from '@nestjs/swagger';
import { AddFavoriteDto as AddFavoriteSchemaDto } from './add-favorite.schema';

export class AddFavoriteDto implements AddFavoriteSchemaDto {
  @ApiProperty({ example: 'd290f1ee-6c54-4b01-90e6-d701748f0851' })
  mediaId: string;
}
