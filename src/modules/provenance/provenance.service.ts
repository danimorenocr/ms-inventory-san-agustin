import { Injectable, NotFoundException } from '@nestjs/common';
import { ProvenanceRepository } from './repository/provenance.repository';
import { CreateProvenanceDto } from './dto/create-provenance.dto';
import { UpdateProvenanceDto } from './dto/update-provenance.dto';

@Injectable()
export class ProvenanceService {
	constructor(private readonly repository: ProvenanceRepository) {}

	create(createDto: CreateProvenanceDto) {
		return this.repository.create(createDto);
	}

	findAll() {
		return this.repository.findAll();
	}

	async findOne(id: number) {
		const provenance = await this.repository.findOne(id);
		if (!provenance) throw new NotFoundException('Procedencia no encontrada');
		return provenance;
	}

	update(id: number, updateDto: UpdateProvenanceDto) {
		return this.repository.update(id, updateDto);
	}

	remove(id: number) {
		return this.repository.remove(id);
	}
}
