import { Inject, Injectable } from '@nestjs/common';
import { writeFile, readFile } from 'fs/promises';
import type { DbModuleOptions } from './db.module';
import { access } from 'fs/promises';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class DbService {
  constructor(@Inject('OPTIONS') private options: DbModuleOptions) {}

  async write(object: Record<string, any>): Promise<void> {
    console.log('Writing to DB:', object);
    await writeFile(this.options.path, JSON.stringify(object, null, 2), {
      encoding: 'utf-8',
    });
  }

  async read(): Promise<User[]> {
    const filePath = this.options.path;

    try {
      await access(filePath);
    } catch {
      return [];
    }

    try {
      const data = await readFile(filePath, { encoding: 'utf8' });
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-unsafe-assignment
      const parsed = JSON.parse(data as string);
      if (Array.isArray(parsed)) return parsed as User[];
      if (parsed && typeof parsed === 'object') return [parsed as User];
      return [];
    } catch {
      return [];
    }
  }
}
