import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
const Consul = require('consul');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors();

  // Validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Inventory Service API')
    .setDescription('Servicio de Inventario')
    .setVersion('1.0')
    .addTag('Inventory')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 4002;
  const SERVICE_NAME = 'inventory-service';
  const HOST = process.env.HOST || 'localhost';

  await app.listen(PORT);
  
  console.log('='.repeat(60));
  console.log(`🔐 ${SERVICE_NAME} running on http://${HOST}:${PORT}`);
  console.log(`📚 Swagger UI: http://${HOST}:${PORT}/api`);
  console.log(`💚 Health check: http://${HOST}:${PORT}/health`);
  console.log('='.repeat(60));

  // ============================================
  // 🔵 REGISTRAR EN CONSUL CON TTL CHECK 
  // ============================================
  const consul = new Consul({
    host: process.env.CONSUL_HOST || 'localhost',
    port: process.env.CONSUL_PORT || '8500',
    promisify: true,
  });

  const serviceId = `${SERVICE_NAME}-${PORT}`;

  try {
    await consul.agent.service.register({
      id: serviceId,
      name: SERVICE_NAME,
      address: HOST,
      port: Number(PORT),
      check: {
        ttl: '10s', // ← Cambio a TTL check
        deregister_critical_service_after: '1m',
      },
      tags: ['inventory', 'rest', 'http'],
      meta: {
        version: '1.0',
        description: 'Inventory microservice',
      },
    });

    console.log(`✅ Service registered in Consul as '${SERVICE_NAME}'`);
    console.log(`🔗 Consul UI: http://localhost:8500/ui/dc1/services/${SERVICE_NAME}`);
    console.log('='.repeat(60));

    // ============================================
    // 💓 HEARTBEAT - Actualizar TTL cada 5 segundos
    // ============================================
    const heartbeatInterval = setInterval(async () => {
      try {
        await consul.agent.check.pass({ id: `service:${serviceId}` });
        // console.log(`💚 Heartbeat sent to Consul`);
      } catch (error) {
        console.error('❌ Error sending heartbeat:', error.message);
      }
    }, 5000); // Cada 5 segundos (TTL es 10s, así que tenemos margen)

    // ============================================
    // 🔌 GRACEFUL SHUTDOWN
    // ============================================
    const gracefulShutdown = async () => {
      console.log('\n🔌 Shutting down gracefully...');
      
      // Detener heartbeat
      clearInterval(heartbeatInterval);
      
      // Desregistrar de Consul
      console.log('📤 Deregistering from Consul...');
      await consul.agent.service.deregister(serviceId);
      console.log('✅ Service deregistered');
      
      process.exit(0);
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);

  } catch (error) {
    console.error('❌ Error registering with Consul:', error.message);
    console.log('⚠️  Service will run without Consul registration');
  }
}

bootstrap();