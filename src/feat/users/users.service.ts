import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'generated/prisma';
import { DatabaseService } from '../../core/database/database.service';
import { AddFavoriteDto } from 'src/shared/dtos/user-dto/add-favorite/add-favorite.schema';
import { CreateUserDto } from 'src/shared/dtos/user-dto/create-user/create-user.schema';

@Injectable()
export class UsersService {
  constructor(private prisma: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const { name } = createUserDto;
    const newUser: User = await this.prisma.user.create({
      data: {
        name,
      },
    });

    return newUser;
  }

  async addFavorite(userId: string, addFavoriteDto: AddFavoriteDto) {
    const { mediaId } = addFavoriteDto;

    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
    });
    if (!media) {
      throw new NotFoundException(
        'A mídia com o ID informado não existe no catálogo.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('O usuário com o ID informado não existe.');
    }

    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_mediaId: {
          userId,
          mediaId,
        },
      },
    });

    if (existingFavorite) {
      throw new BadRequestException(
        'Esta mídia já está na lista de favoritos.',
      );
    }

    await this.prisma.favorite.create({
      data: {
        userId,
        mediaId,
      },
    });

    return;
  }

  async getFavorites(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        favorites: {
          include: {
            media: {
              select: {
                id: true,
                title: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!user.favorites) {
      return [];
    }

    return user.favorites.map((favorite) => favorite.media);
  }

  async removeFavorite(userId: string, mediaId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_mediaId: {
          userId,
          mediaId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorito não encontrado.');
    }

    await this.prisma.favorite.delete({
      where: {
        id: favorite.id,
      },
    });

    return;
  }
}
