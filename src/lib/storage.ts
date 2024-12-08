import { nanoid } from 'nanoid';

interface StorageState {
  users: any[];
  tenants: any[];
  addresses: any[];
  subscriptions: any[];
  leads: any[];
  version: number;
  lastUpdated: string;
}

class Storage {
  private static instance: Storage | null = null;
  private state: StorageState;
  private readonly VERSION = 2;

  private constructor() {
    this.state = this.getInitialState();
    this.loadState();
  }

  public static getInstance(): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }
    return Storage.instance;
  }

  private loadState(): void {
    try {
      const savedState = sessionStorage.getItem('app_state');
      if (savedState) {
        this.state = JSON.parse(savedState);
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
  }

  private saveState(): void {
    try {
      sessionStorage.setItem('app_state', JSON.stringify(this.state));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }

  private getInitialState(): StorageState {
    return {
      users: [],
      tenants: [],
      addresses: [],
      subscriptions: [],
      leads: [],
      version: this.VERSION,
      lastUpdated: new Date().toISOString()
    };
  }

  public clearAll(): void {
    sessionStorage.clear();
    this.state = this.getInitialState();
    this.saveState();
  }

  public findUserByEmail(email: string) {
    return this.state.users.find(user => 
      user.email === email && user.status === 'active'
    );
  }

  public createUser(userData: any) {
    const existingUser = this.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = {
      ...userData,
      id: `user_${nanoid()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    };

    this.state.users.push(user);
    this.saveState();
    return user;
  }

  public createTenant(tenantData: any) {
    const tenant = {
      ...tenantData,
      id: `tenant_${nanoid()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    };

    this.state.tenants.push(tenant);
    this.saveState();
    return tenant;
  }

  public getUsers(): any[] {
    return [...this.state.users];
  }

  public getTenants(): any[] {
    return [...this.state.tenants];
  }

  public getState(): StorageState {
    return { ...this.state };
  }
}

export const storage = Storage.getInstance();