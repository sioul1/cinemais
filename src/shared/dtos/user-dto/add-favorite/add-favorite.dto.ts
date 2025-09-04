import { ApiProperty } from '@nestjs/swagger';
import { AddFavoriteDto as AddFavoriteSchemaDto } from './add-favorite.schema';

export class AddFavoriteDto implements AddFavoriteSchemaDto {
  @ApiProperty({ example: 'algumcuidvalido' })
  mediaId: string;
}
