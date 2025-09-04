import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service';

const prismaMock = {
  user: {
    findUnique: jest.fn().mockResolvedValue({ id: 'user-1' }),
  },
  media: {
    findUnique: jest.fn().mockResolvedValue({ id: 'media-1' }),
  },
  favorite: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DatabaseService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('addFavorite', () => {
    it('deve adicionar uma mídia aos favoritos de um usuário se não existir', async () => {
      const addFavoriteDto = { mediaId: 'media-1' };
      prismaMock.favorite.findUnique.mockResolvedValueOnce(null);

      await service.addFavorite('user-1', addFavoriteDto);

      expect(prismaMock.favorite.create).toHaveBeenCalledWith({
        data: { userId: 'user-1', mediaId: 'media-1' },
      });
      expect(prismaMock.favorite.findUnique).toHaveBeenCalled();
    });

    it('deve lançar um NotFoundException se a mídia não existir', async () => {
      prismaMock.media.findUnique.mockResolvedValueOnce(null);
      const addFavoriteDto = { mediaId: 'non-existent-media' };
      await expect(
        service.addFavorite('user-1', addFavoriteDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve lançar um BadRequestException se a mídia já for um favorito', async () => {
      const addFavoriteDto = { mediaId: 'media-1' };
      prismaMock.favorite.findUnique.mockResolvedValueOnce({
        id: 'fav-1',
        userId: 'user-1',
        mediaId: 'media-1',
      });
      await expect(
        service.addFavorite('user-1', addFavoriteDto),
      ).rejects.toThrow(BadRequestException);
      expect(prismaMock.favorite.create).not.toHaveBeenCalled();
    });
  });

  describe('removeFavorite', () => {
    it('deve remover um favorito com sucesso', async () => {
      prismaMock.favorite.findUnique.mockResolvedValueOnce({ id: 'fav-1' });
      await service.removeFavorite('user-1', 'media-1');
      expect(prismaMock.favorite.delete).toHaveBeenCalledWith({
        where: { id: 'fav-1' },
      });
    });

    it('deve lançar um NotFoundException se o favorito não existir', async () => {
      prismaMock.favorite.findUnique.mockResolvedValueOnce(null);
      await expect(
        service.removeFavorite('user-1', 'non-existent-media'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
