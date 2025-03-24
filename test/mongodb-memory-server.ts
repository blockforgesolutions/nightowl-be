import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

export class MongodbMemoryServer {
  private static mongoServer: MongoMemoryServer;

  static async start(): Promise<string> {
    this.mongoServer = await MongoMemoryServer.create();
    const uri = this.mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    return uri;
  }

  static async stop(): Promise<void> {
    await mongoose.disconnect();
    await this.mongoServer.stop();
  }

  static async cleanup(): Promise<void> {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
} 