import { storage } from './storage';

class MockDb {
  private static instance: MockDb | null = null;

  private constructor() {}

  public static getInstance(): MockDb {
    if (!MockDb.instance) {
      MockDb.instance = new MockDb();
    }
    return MockDb.instance;
  }

  public findUserByEmail(email: string) {
    return storage.findUserByEmail(email);
  }

  public createUser(data: any) {
    return storage.createUser(data);
  }

  public createTenant(data: any) {
    return storage.createTenant(data);
  }

  public clearAllData() {
    storage.clearAll();
  }

  public getState() {
    return storage.getState();
  }
}

export const mockDb = MockDb.getInstance();
