import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from './media.service';
import { NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service';

const prismaMock = {
  media: {
    create: jest.fn().mockResolvedValue({ id: '1', title: 'Test Movie' }),
    findMany: jest.fn().mockResolvedValue([{ id: '1', title: 'Test Movie' }]),
    findUnique: jest.fn().mockResolvedValue({ id: '1', title: 'Test Movie' }),
  },
};

describe('MediaService', () => {
  let service: MediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: DatabaseService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma nova mídia e retorná-la', async () => {
      const createMediaDto = {
        title: 'Matrix Genérica',
        description: 'Um dev descobre que o mundo é uma simulação.',
        type: 'movie' as const,
        releaseYear: 2025,
        genre: 'Ficção Científica',
      };
      const result = await service.create(createMediaDto);
      expect(prismaMock.media.create).toHaveBeenCalledWith({
        data: createMediaDto,
      });
      expect(result).toEqual({ id: '1', title: 'Test Movie' });
    });
  });

  describe('findAll', () => {
    it('deve retornar um array de mídias', async () => {
      const result = await service.findAll();
      expect(prismaMock.media.findMany).toHaveBeenCalled();
      expect(result).toEqual([{ id: '1', title: 'Test Movie' }]);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma mídia se encontrada', async () => {
      const result = await service.findOne('1');
      expect(prismaMock.media.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual({ id: '1', title: 'Test Movie' });
    });

    it('deve lançar um NotFoundException se a mídia não for encontrada', async () => {
      prismaMock.media.findUnique.mockResolvedValueOnce(null);
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
