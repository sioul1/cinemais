/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MediaModule } from './media.module';
import { DatabaseService } from '../../core/database/database.service';

const prismaServiceMock = {
  media: {
    create: jest.fn().mockResolvedValue({
      id: 'mock-id-123',
      title: 'Matrix Genérica',
      description: 'Um dev descobre que o mundo é uma simulação.',
      type: 'movie',
      releaseYear: 2025,
      genre: 'Ficção Científica',
    }),
  },
};

describe('MediaController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MediaModule],
    })
      .overrideProvider(DatabaseService)
      .useValue(prismaServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/media (POST) - Deve criar uma nova mídia e retornar 201', async () => {
    const createMediaDto = {
      title: 'Matrix Genérica',
      description: 'Um dev descobre que o mundo é uma simulação.',
      type: 'movie',
      releaseYear: 2025,
      genre: 'Ficção Científica',
    };

    return request(app.getHttpServer())
      .post('/media')
      .send(createMediaDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual({
          id: 'mock-id-123',
          ...createMediaDto,
        });
      });
  });

  it('/media (POST) - Deve retornar 400 se os dados forem inválidos', () => {
    const invalidDto = {
      title: 'Matrix Genérica',
      type: 'invalid_type',
    };

    return request(app.getHttpServer())
      .post('/media')
      .send(invalidDto)
      .expect(400);
  });
});
