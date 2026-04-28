import fs from 'fs';
import path from 'path';

import { parse } from 'csv-parse/sync';

export const readCsv = <T = Record<string, string>>(fileName: string): T[] => {
  const filePath = path.join(process.cwd(), 'prisma', 'seed', 'data', fileName);

  const content = fs.readFileSync(filePath, 'utf-8');

  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
};