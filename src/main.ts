import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const appClient = configService.get<string>('APP_CLIENT');

  app.enableCors({
    origin: `${appClient}`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Elock API')
    .setDescription('API para sistema de tranca IoT')
    .setVersion('1.0')
    .addBearerAuth(  
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Insira o token JWT no formato Bearer <token>',
        in: 'header',
      },
      'jwt-auth', 
    )
    .addTag('auth')
    .addTag('users')
    .addTag('door-locks')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
