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

  const PORT = process.env.PORT || 4003;
  const SERVICE_NAME = 'inventory-service';
  const HOST = process.env.HOST || 'localhost';

  // URL pública del microservicio
  const SERVICE_HOST =
    process.env.SERVICE_HOST ||
    (process.env.NODE_ENV === 'production'
      ? 'ms-inventory-san-agustin-production.up.railway.app'
      : 'localhost');

  await app.listen(PORT, '0.0.0.0');

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
    port: Number(process.env.CONSUL_PORT) || 8500,
    secure: process.env.NODE_ENV === 'production',
    promisify: true,
  });

  const serviceId = `${SERVICE_NAME}-${PORT}`;

  // ============================================
  // REGISTER WITH RETRIES
  // ============================================
  const registerWithConsul = async (retries = 10): Promise<boolean> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔄 Registering with Consul... (${attempt}/${retries})`);
        const IS_PRODUCTION = process.env.NODE_ENV === 'production';
        await consul.agent.service.register({
          id: serviceId,
          name: SERVICE_NAME,
          address: SERVICE_HOST,
          port: IS_PRODUCTION ? 443 : Number(PORT), // ✅ 443 en producción
          check: {
            ttl: '10s',
            deregister_critical_service_after: '1m',
          },
          tags: ['inventory', 'rest', 'http'],
          meta: {
            version: '1.0',
            description: 'Inventory microservice',
          },
        });

        console.log('='.repeat(60));
        console.log(`✅ Service registered in Consul as '${SERVICE_NAME}'`);
        console.log(`🆔 Service ID: ${serviceId}`);
        console.log(`🌍 Public Host: ${SERVICE_HOST}`);
        console.log(`🔗 Consul UI: http://localhost:8500/ui/dc1/services/${SERVICE_NAME}`);
        console.log('='.repeat(60));

        return true;
      } catch (error: any) {
        console.error(`❌ Consul registration failed: ${error.message}`);

        if (attempt < retries) {
          console.log('⏳ Waiting 5 seconds before retry...');
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
    }

    return false;
  };

  // ============================================
  // EXECUTE REGISTRATION
  // ============================================
  const registered = await registerWithConsul();

  // ============================================
  // 💓 HEARTBEAT - Actualizar TTL cada 5 segundos
  // ============================================
  let heartbeatInterval: NodeJS.Timeout;

  if (registered) {
    heartbeatInterval = setInterval(async () => {
      try {
        await consul.agent.check.pass({ id: `service:${serviceId}` });
        // console.log(`💚 Heartbeat sent to Consul`);
      } catch (error) {
        console.error('❌ Error sending heartbeat:', error.message);
      }
    }, 5000); // Cada 5 segundos (TTL es 10s, así que tenemos margen)
  } else {
    console.log('⚠️ Service running WITHOUT Consul registration');
  }

  // ============================================
  // 🔌 GRACEFUL SHUTDOWN
  // ============================================
  const gracefulShutdown = async () => {
    console.log('\n🔌 Shutting down gracefully...');

    // Detener heartbeat
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }

    // Desregistrar de Consul
    if (registered) {
      try {
        console.log('📤 Deregistering from Consul...');
        await consul.agent.service.deregister(serviceId);
        console.log('✅ Service deregistered');
      } catch (error: any) {
        console.error('❌ Error deregistering:', error.message);
      }
    }

    process.exit(0);
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
}

bootstrap();