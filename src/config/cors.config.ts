import { env } from './env';

import type { CorsOptions } from 'cors';


const normalizeOrigins = (origins: string): CorsOptions['origin'] => {
  const trimmed = origins.trim();
  if (trimmed === '*') {
    return true;
  }

  const values = trimmed
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (values.length === 0) {
    return true;
  }

  return values;
};




export const corsConfig: CorsOptions = {
  origin: normalizeOrigins(env.corsOrigins),
  credentials: true,
};
