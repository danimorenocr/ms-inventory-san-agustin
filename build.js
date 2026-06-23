const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  entryPoints: ['dist/src/main.js'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/index.js',
  external: [
    '@prisma/client',
    '@prisma/client-local',
    'bcrypt',
    'pg',
    '@nestjs/microservices',
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
    '@nestjs/swagger',
    'class-transformer',
    'class-transformer/storage',
    'class-validator',
  ],
  sourcemap: true,
}).catch(() => process.exit(1));
