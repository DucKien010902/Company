import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // log request ở môi trường dev
  app.use(morgan('dev'));

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);

  console.log(`API is running at http://localhost:${port}/api`);
}

bootstrap();