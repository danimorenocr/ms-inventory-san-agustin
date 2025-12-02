Instalar dependencias: 

npm init -y
# Instala Nest CLI (opcional)
npm i -D @nestjs/cli
# Instala dependencias
npm i @nestjs/common @nestjs/core @nestjs/platform-express reflect-metadata rxjs
# Prisma y Postgres client
npm i prisma @prisma/client
# para validaciones DTO
npm i class-validator class-transformer
# TypeScript
npm i -D typescript ts-node-dev @types/node


Archivo: prisma/seed.ts

⚠ Importante:
Antes de correr npx prisma db seed, asegúrate que tu package.json tenga:

"prisma": {
  "seed": "ts-node prisma/seed.ts"
}


Crear bd: 
npx prisma migrate dev --name init


Generar cliente 
npx prisma generate
