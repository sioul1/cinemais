import { Injectable, NotFoundException } from '@nestjs/common';
import { Media } from 'generated/prisma';
import { DatabaseService } from '../../core/database/database.service';
import { CreateMediaDto } from 'src/shared/dtos/media-dto/create-media.schema';

@Injectable()
export class MediaService {
  constructor(private prisma: DatabaseService) {}

  async create(createMediaDto: CreateMediaDto) {
    const newMedia: Media = await this.prisma.media.create({
      data: createMediaDto,
    });

    return newMedia;
  }

  async findAll() {
    const Medias: Media[] = await this.prisma.media.findMany();

    return Medias;
  }

  async findOne(id: string): Promise<Media> {
    const media: Media | null = await this.prisma.media.findUnique({
      where: { id },
    });
    if (!media) {
      throw new NotFoundException('A mídia com o ID informado não existe.');
    }
    return media;
  }
}
