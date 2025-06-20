import { DocumentBuilder } from '@nestjs/swagger';

export const ApiSwaggerOptions = new DocumentBuilder()
  .setTitle('Ameen group  API')
  .setDescription('API documentation for Ameen group ')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'token',
  )
  .build();
