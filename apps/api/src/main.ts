import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  // Creates the Nest application instance from the root module "AppModule"
  const app = await NestFactory.create(AppModule);

  // Converts the raw cookie string from the request header into a usable object (request.cookie)
  app.use(cookieParser());

  // Allows the dashboard (different origin) to call this API and send / receive cookies
  app.enableCors({
    origin: process.env.DASHBOARD_URL,
    credentials: true,
  });

  // Applies request validation / transformation globally, based on each route's DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties not defined in the DTO
      forbidNonWhitelisted: true, // throws an error if extra properties are sent
      transform: true, // auto-converts payloads to their DTO class instances / types
    }),
  );

  // Starts the HTTP server on the configured port (defaults to 3000)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
