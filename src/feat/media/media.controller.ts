import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { MediaService } from './media.service';
import { createMediaSchema } from 'src/shared/dtos/media-dto/create-media.schema';
import { CreateMediaDto } from 'src/shared/dtos/media-dto/create-media.dto';
import { ZodValidationPipe } from 'src/shared/pipes/zod-validation.pipe';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createMediaSchema))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Adiciona um novo item (filme ou série) ao catálogo.',
  })
  @ApiBody({ type: CreateMediaDto, description: 'Dados para criação da mídia' })
  @ApiResponse({
    status: 201,
    description: 'O objeto da mídia recém-criada, incluindo um id único.',
    type: CreateMediaDto,
  })
  async create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista todos os itens de mídia disponíveis no catálogo.',
  })
  @ApiResponse({
    status: 200,
    description: 'Um array com todos os objetos de mídia.',
  })
  async findAll() {
    return this.mediaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um item de mídia específico pelo seu id.' })
  @ApiParam({
    name: 'id',
    description: 'ID da mídia',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @ApiResponse({
    status: 200,
    description: 'O objeto da mídia correspondente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Se a mídia com o ID informado não existir.',
  })
  async findOne(@Param('id') id: string) {
    return this.mediaService.findOne(id);
  }
}
