if (typeof global.localStorage === 'undefined') {
  class LocalStorageMock {
    private store: Record<string, string> = {};

    clear() {
      this.store = {};
    }

    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
    }

    setItem(key: string, value: string) {
      this.store[key] = value;
    }

    removeItem(key: string) {
      delete this.store[key];
    }
  }

  global.localStorage = new LocalStorageMock() as any;
}
