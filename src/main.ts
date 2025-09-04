/* eslint-disable @typescript-eslint/no-floating-promises */
import { /* HttpAdapterHost */ NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { AllExceptionsFilter } from './core/filters/all-exception.filter';
// import { LoggingInterceptor } from './core/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('CINEMAIS API')
    .setDescription(
      'Documentação da API do PROJETO Cinemais para gerenciar filmes e favoritos.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log('Server is running at port', process.env.PORT);
}
bootstrap();
