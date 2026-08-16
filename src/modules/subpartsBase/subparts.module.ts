import { Module } from '@nestjs/common';
import { SubpartsService } from './subparts.service';
import { SubpartsController } from './subparts.controller';
import { SubpartsRepository } from './repository/subparts.repository';
import { PrismaModule } from '../../infraestructure/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	controllers: [SubpartsController],
	providers: [SubpartsService, SubpartsRepository],
	exports: [SubpartsService],
})
export class SubpartsModule {}

