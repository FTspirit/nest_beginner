import { Inject, Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import type { DbModuleOptions } from './db.module';

@Injectable()
export class DbService {
  constructor(@Inject('OPTIONS') private options: DbModuleOptions) {}

  async write(object: Record<string, any>): Promise<void> {
    console.log('Writing to DB:', object);
    await writeFile(this.options.path, JSON.stringify(object, null, 2), {
      encoding: 'utf-8',
    });
  }
}
