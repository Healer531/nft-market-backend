import { NestFactory } from '@nestjs/core';
import * as DotEnv from 'dotenv';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  DotEnv.config();
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Aurora API Documentation')
    .setDescription('This documentation is for Aurora')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
