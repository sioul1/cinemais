import { ApiProperty } from '@nestjs/swagger';
import { CreateMediaDto as CreateMediaSchemaDto } from './create-media.schema';

export class CreateMediaDto implements CreateMediaSchemaDto {
  @ApiProperty({ example: 'Matrix Genérica' })
  title: string;

  @ApiProperty({
    example: 'Um dev descobre que o mundo é uma simulação e precisa debugá-lo.',
  })
  description: string;

  @ApiProperty({ example: 'movie', enum: ['movie', 'series'] })
  type: 'movie' | 'series';

  @ApiProperty({ example: 2025 })
  releaseYear: number;

  @ApiProperty({ example: 'Ficção Científica' })
  genre: string;
}
