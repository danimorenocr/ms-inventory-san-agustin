import { Injectable } from '@nestjs/common';
import { PrismaLocalService } from '../../../infraestructure/prisma/prisma-local.service';
import { CreateProvenanceDto } from '../dto/create-provenance.dto';
import { UpdateProvenanceDto } from '../dto/update-provenance.dto';

@Injectable()
export class ProvenanceRepository {
	constructor(private readonly prisma: PrismaLocalService) {}

	async create(createProvenanceDto: CreateProvenanceDto) {
		return this.prisma.procedencia.create({
			data: createProvenanceDto,
		});
	}

	async findAll() {
		return this.prisma.procedencia.findMany();
	}

	async findOne(id: number) {
		return this.prisma.procedencia.findUnique({
			where: { id },
		});
	}

	async update(id: number, updateProvenanceDto: UpdateProvenanceDto) {
		return this.prisma.procedencia.update({
			where: { id },
			data: updateProvenanceDto,
		});
	}

	async remove(id: number) {
		return this.prisma.procedencia.delete({
			where: { id },
		});
	}
}
