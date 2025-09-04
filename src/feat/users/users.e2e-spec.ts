/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { DatabaseService } from '../../core/database/database.service';
import { UserModule } from './users.module';

const cuid = require('cuid');

const validUserId = cuid();
const validMediaId = cuid();
const nonExistentId = cuid();

const databaseServiceMock = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
  media: {
    findUnique: jest.fn(),
  },
  favorite: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(DatabaseService)
      .useValue(databaseServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /users', () => {
    it('Deve criar um novo usuário e retornar 201', async () => {
      const createUserDto = { name: 'Test User' };
      jest
        .spyOn(databaseServiceMock.user, 'create')
        .mockResolvedValueOnce({ id: validUserId, name: 'Test User' });

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toEqual({ id: validUserId, name: 'Test User' });
        });
    });
  });

  describe('POST /users/:userId/favorites', () => {
    it('Deve adicionar um favorito e retornar 204 No Content', async () => {
      const addFavoriteDto = { mediaId: validMediaId };

      jest
        .spyOn(databaseServiceMock.media, 'findUnique')
        .mockResolvedValueOnce({
          id: validMediaId,
          title: 'Test Movie',
          type: 'movie',
        });

      jest
        .spyOn(databaseServiceMock.user, 'findUnique')
        .mockResolvedValueOnce({ id: validUserId });

      jest
        .spyOn(databaseServiceMock.favorite, 'findUnique')
        .mockResolvedValueOnce(null);

      jest.spyOn(databaseServiceMock.favorite, 'create').mockResolvedValueOnce({
        id: 'cuidfavvalido',
        userId: validUserId,
        mediaId: validMediaId,
      });

      return request(app.getHttpServer())
        .post(`/users/${validUserId}/favorites`)
        .send(addFavoriteDto)
        .expect(HttpStatus.NO_CONTENT);
    });
  });

  it('Deve retornar 400 Bad Request se tentar adicionar favorito duplicado', async () => {
    const addFavoriteDto = { mediaId: validMediaId };

    jest.spyOn(databaseServiceMock.media, 'findUnique').mockResolvedValueOnce({
      id: validMediaId,
      title: 'Test Movie',
      type: 'movie',
    });

    jest
      .spyOn(databaseServiceMock.user, 'findUnique')
      .mockResolvedValueOnce({ id: validUserId });

    jest
      .spyOn(databaseServiceMock.favorite, 'findUnique')
      .mockResolvedValueOnce({
        id: 'existing-favorite-id',
        userId: validUserId,
        mediaId: validMediaId,
      });

    return request(app.getHttpServer())
      .post(`/users/${validUserId}/favorites`)
      .send(addFavoriteDto)
      .expect(HttpStatus.BAD_REQUEST)
      .expect((res) => {
        expect(res.body.message).toBe(
          'Esta mídia já está na lista de favoritos.',
        );
      });
  });

  describe('GET /users/:userId/favorites', () => {
    it('Deve listar os favoritos de um usuário e retornar 200 OK', async () => {
      jest.spyOn(databaseServiceMock.user, 'findUnique').mockResolvedValueOnce({
        id: validUserId,
        name: 'Test User',
        favorites: [
          {
            id: 'cuidfavvalido',
            userId: validUserId,
            mediaId: validMediaId,
            media: {
              id: validMediaId,
              title: 'Test Movie',
              type: 'movie',
            },
          },
        ],
      });

      return request(app.getHttpServer())
        .get(`/users/${validUserId}/favorites`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual([
            { id: validMediaId, title: 'Test Movie', type: 'movie' },
          ]);
        });
    });
  });

  describe('DELETE /users/:userId/favorites/:mediaId', () => {
    it('Deve remover um favorito e retornar 204 No Content', async () => {
      jest
        .spyOn(databaseServiceMock.favorite, 'findUnique')
        .mockResolvedValueOnce({
          id: 'cuidfavvalido',
          userId: validUserId,
          mediaId: validMediaId,
        });

      jest.spyOn(databaseServiceMock.favorite, 'delete').mockResolvedValueOnce({
        id: 'cuidfavvalido',
        userId: validUserId,
        mediaId: validMediaId,
      });

      return request(app.getHttpServer())
        .delete(`/users/${validUserId}/favorites/${validMediaId}`)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('Deve retornar 404 Not Found se o favorito não existir', async () => {
      jest
        .spyOn(databaseServiceMock.favorite, 'findUnique')
        .mockResolvedValueOnce(null);

      return request(app.getHttpServer())
        .delete(`/users/${validUserId}/favorites/${nonExistentId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
