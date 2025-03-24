import { config } from 'dotenv';
import { MongodbMemoryServer } from './mongodb-memory-server';
import * as jest from '@jest/globals';

// Test ortamı için .env.test dosyasını yükle
config({ path: '.env.test' });

// MongoDB bellek sunucusunu başlat
jest.beforeAll(async () => {
  await MongodbMemoryServer.start();
});

// Testler arasında veritabanını temizle
jest.afterEach(async () => {
  await MongodbMemoryServer.cleanup();
});

// Test tamamlandığında bağlantıyı kapat
jest.afterAll(async () => {
  await MongodbMemoryServer.stop();
});

// Global test zaman aşımını artırma
jest.setTimeout(30000); 