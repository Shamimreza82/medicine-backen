import request from 'supertest';
import { describe, it, expect } from 'vitest';

import { createApp } from '@/app';

describe('Auth API', () => {
  it('should login user', async () => {
    const app = createApp();

    const res = await request(app).post('/auth/login').send({
      email: 'admin@test.com',
      password: '123456',
    });

    expect(res.status).toBe(200);
  });
});
