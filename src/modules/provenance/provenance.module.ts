import { Module } from '@nestjs/common';
import { ProvenanceService } from './provenance.service';
import { ProvenanceController } from './provenance.controller';
import { ProvenanceRepository } from './repository/provenance.repository';
import { PrismaModule } from '../../infraestructure/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	controllers: [ProvenanceController],
	providers: [ProvenanceService, ProvenanceRepository],
	exports: [ProvenanceService],
})
export class ProvenanceModule {}

