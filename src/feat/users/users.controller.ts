import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ZodValidationPipe } from '../../shared/pipes/zod-validation.pipe';
import { createUserSchema } from '../../shared/dtos/user-dto/create-user/create-user.schema';
import { CreateUserDto } from '../../shared/dtos/user-dto/create-user/create-user.dto';
import { addFavoriteSchema } from '../../shared/dtos/user-dto/add-favorite/add-favorite.schema';
import { AddFavoriteDto } from '../../shared/dtos/user-dto/add-favorite/add-favorite.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo usuário.' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Dados para criação do usuário.',
  })
  @ApiResponse({
    status: 201,
    description: 'O objeto do usuário recém-criado, incluindo um id único.',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post(':userId/favorites')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Adiciona um item de mídia à lista de favoritos de um usuário.',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID do usuário',
    example: 'cmf2sina400006zpwpb1rzqxt',
  })
  @ApiBody({
    type: AddFavoriteDto,
    description: 'ID da mídia a ser adicionada.',
  })
  @ApiResponse({ status: 204, description: 'Operação bem-sucedida.' })
  @ApiResponse({
    status: 404,
    description:
      'Se o mediaId não existir no catálogo ou o userId não existir.',
  })
  async addFavorite(
    @Param('userId') userId: string,
    @Body(new ZodValidationPipe(addFavoriteSchema))
    addFavoriteDto: AddFavoriteDto,
  ) {
    await this.usersService.addFavorite(userId, addFavoriteDto);
  }

  @Get(':userId/favorites')
  @ApiOperation({
    summary: 'Lista todos os itens da lista de favoritos de um usuário.',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID do usuário',
    example: 'cmf2sina400006zpwpb1rzqxt',
  })
  @ApiResponse({
    status: 200,
    description:
      'Um array com os objetos de mídia completos que foram favoritados pelo usuário.',
  })
  async getFavorites(@Param('userId') userId: string) {
    return this.usersService.getFavorites(userId);
  }

  @Delete(':userId/favorites/:mediaId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove um item de mídia da lista de favoritos de um usuário.',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID do usuário',
    example: 'cmf2sina400006zpwpb1rzqxt',
  })
  @ApiParam({
    name: 'mediaId',
    description: 'ID da mídia',
    example: 'cmf2sina400006zpwpb1rzqxt',
  })
  @ApiResponse({ status: 204, description: 'Operação bem-sucedida.' })
  @ApiResponse({
    status: 404,
    description: 'Se o favorito não for encontrado.',
  })
  async removeFavorite(
    @Param('userId') userId: string,
    @Param('mediaId') mediaId: string,
  ) {
    await this.usersService.removeFavorite(userId, mediaId);
  }
}
