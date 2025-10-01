import { jest } from '@jest/globals';

// Extend Jest matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Global test setup
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;

  // Mock external services
  jest.mock('@upstash/redis', () => ({
    Redis: jest.fn().mockImplementation(() => ({
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      pipeline: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([])
      }),
      zremrangebyscore: jest.fn(),
      zcard: jest.fn().mockResolvedValue(0),
      zadd: jest.fn(),
      expire: jest.fn(),
      keys: jest.fn().mockResolvedValue([])
    }))
  }));

  // Mock WebSocket for sync service
  jest.mock('socket.io', () => ({
    Server: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      to: jest.fn().mockReturnValue({
        emit: jest.fn()
      }),
      sockets: {
        sockets: new Map()
      }
    }))
  }));

  // Mock file system operations for backup service
  jest.mock('fs/promises', () => ({
    mkdir: jest.fn(),
    stat: jest.fn().mockResolvedValue({ size: 1000 }),
    unlink: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn()
  }));

  jest.mock('fs', () => ({
    createWriteStream: jest.fn().mockReturnValue({
      write: jest.fn(),
      end: jest.fn()
    }),
    createReadStream: jest.fn().mockReturnValue({
      pipe: jest.fn(),
      [Symbol.asyncIterator]: jest.fn().mockReturnValue({
        next: jest.fn().mockResolvedValue({ done: true })
      })
    })
  }));

  // Mock crypto for backup encryption
  jest.mock('crypto', () => ({
    createHash: jest.fn().mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue('mock-hash')
    }),
    randomBytes: jest.fn().mockReturnValue(Buffer.from('mock-random-bytes')),
    createCipher: jest.fn().mockReturnValue({
      pipe: jest.fn(),
      write: jest.fn(),
      end: jest.fn()
    }),
    createDecipher: jest.fn().mockReturnValue({
      pipe: jest.fn()
    })
  }));

  // Mock compression
  jest.mock('zlib', () => ({
    createGzip: jest.fn().mockReturnValue({
      pipe: jest.fn()
    }),
    createGunzip: jest.fn().mockReturnValue({
      pipe: jest.fn()
    })
  }));

  // Mock OS module for system monitoring
  jest.mock('os', () => ({
    cpus: jest.fn().mockReturnValue([
      { times: { user: 1000, nice: 0, sys: 500, idle: 8500, irq: 0 } }
    ]),
    loadavg: jest.fn().mockReturnValue([0.5, 0.6, 0.7]),
    totalmem: jest.fn().mockReturnValue(8 * 1024 * 1024 * 1024), // 8GB
    freemem: jest.fn().mockReturnValue(4 * 1024 * 1024 * 1024)   // 4GB
  }));

  console.log('Test environment initialized');
});

afterAll(async () => {
  console.log('Test environment cleaned up');
});

// Global error handler for uncaught exceptions in tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Type declarations for custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(floor: number, ceiling: number): R;
    }
  }
}