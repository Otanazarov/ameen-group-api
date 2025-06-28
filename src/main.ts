import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { env } from './common/config';
import { HttpExceptionFilter } from './common/filter/httpException.filter';
import { ApiSwaggerOptions } from './common/swagger/config.swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*' },
    rawBody: true,
  });

  app.setGlobalPrefix('/api');
  app.use('/webhook', bodyParser.raw({ type: 'application/json' }));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((err) => {
          const constraints = Object.values(err.constraints || {});
          return `${err.property}: ${constraints.join(', ')}`;
        });
        return new BadRequestException(messages.join(' | '));
      },
    }),
  );

  if (env.ENV == 'dev') {
    const ApiDocs = SwaggerModule.createDocument(app, ApiSwaggerOptions);
    SwaggerModule.setup('docs', app, ApiDocs, {
      customCssUrl: './public/swagger.css',
    });
  }
  await app.listen(env.PORT || 3000);
}
bootstrap();
