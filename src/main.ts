import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors();

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('MS Inventory - Carnicería San Agustín')
    .setDescription('API de gestión de inventario para carnicería')
    .setVersion('1.0')
    .addTag('Categorías Base')
    .addTag('Subpartes Base')
    .addTag('Productos Base')
    .addTag('Lotes')
    .addTag('Categorías de Lote')
    .addTag('Subpartes de Lote')
    .addTag('Lotes Individuales')
    .addTag('Proveedores')
    .addTag('Alertas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
 
  
  // Ruta JSON de Swagger (para descargar)
  app.use('/api/docs-json', (req, res) => {
    res.json(document);
  });

  // Setup UI de Swagger + enlace al JSON
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      url: '/api/docs-json',  // permite descargar el JSON desde Swagger UI
    },
  });

  const port = process.env.PORT || 4001;
  await app.listen(port);

  console.log(`🚀 Aplicación corriendo en: http://localhost:${port}`);
  console.log(`📚 Documentación Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();
