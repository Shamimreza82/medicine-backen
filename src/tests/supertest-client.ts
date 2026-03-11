// src/tests/supertest-client.ts
import request from 'supertest';

import { createApp } from '@/app';
const app = createApp();
export const api = request(app);

// 3️⃣ supertest-client.ts

// এটা API testing helper।

// Express API test করতে supertest ব্যবহার করা হয়।
