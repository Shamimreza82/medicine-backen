// src/tests/test-server.ts
import { createApp } from '@/app';

export function createTestServer() {
  const app = createApp();
  return app;
}

// 4️⃣ test-server.ts

// এটা test server instance।

// কিছু ক্ষেত্রে app import করলে server start হয়ে যায়। সেটা avoid করতে test server আলাদা বানানো হয়।
