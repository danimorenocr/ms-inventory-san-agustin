import { Controller, Post } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('force-pull')
  async forcePull() {
    await this.syncService.pullRemoteChanges();
    return { success: true };
  }
}
