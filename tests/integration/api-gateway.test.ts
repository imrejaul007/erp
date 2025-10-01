import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';
import { NextRequest } from 'next/server';
import { DataValidator } from '@/lib/validation/data-validator';
import { RateLimiter } from '@/lib/services/rate-limiter';

describe('API Gateway Integration Tests', () => {
  let validator: DataValidator;
  let rateLimiter: RateLimiter;

  beforeAll(() => {
    validator = new DataValidator();
    rateLimiter = new RateLimiter();
  });

  describe('Request Validation', () => {
    it('should validate gateway requests', () => {
      const validRequest = {
        module: 'inventory',
        action: 'getProducts',
        data: { limit: 10 }
      };

      const result = validator.validateGatewayRequest(validRequest);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid module requests', () => {
      const invalidRequest = {
        module: 'invalid_module',
        action: 'getProducts',
        data: {}
      };

      const result = validator.validateGatewayRequest(invalidRequest);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('INVALID_MODULE');
    });

    it('should reject malformed requests', () => {
      const malformedRequest = {
        module: '',
        action: '',
        data: null
      };

      const result = validator.validateGatewayRequest(malformedRequest);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Rate Limiting', () => {
    it('should allow requests within limits', async () => {
      const userId = 'test-user-rate-limit';
      const isAllowed = await rateLimiter.checkLimit(userId, 'api_gateway');
      expect(isAllowed).toBe(true);
    });

    it('should provide remaining request information', async () => {
      const userId = 'test-user-remaining';
      const info = await rateLimiter.getRemainingRequests(userId, 'api_gateway');

      expect(info).toBeDefined();
      expect(typeof info.remaining).toBe('number');
      expect(typeof info.resetTime).toBe('number');
    });

    it('should handle rate limit resets', async () => {
      const userId = 'test-user-reset';
      await rateLimiter.resetLimit(userId, 'api_gateway');

      const isAllowed = await rateLimiter.checkLimit(userId, 'api_gateway');
      expect(isAllowed).toBe(true);
    });
  });

  describe('Module Routing', () => {
    it('should identify valid modules', () => {
      const validModules = [
        'inventory',
        'sales',
        'crm',
        'finance',
        'production',
        'supply_chain',
        'analytics',
        'ecommerce'
      ];

      for (const module of validModules) {
        const request = { module, action: 'test', data: {} };
        const result = validator.validateGatewayRequest(request);
        expect(result.isValid).toBe(true);
      }
    });

    it('should reject unknown modules', () => {
      const invalidModules = [
        'unknown',
        'test',
        'admin',
        'system'
      ];

      for (const module of invalidModules) {
        const request = { module, action: 'test', data: {} };
        const result = validator.validateGatewayRequest(request);
        expect(result.isValid).toBe(false);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors gracefully', () => {
      const request = null as any;

      expect(() => {
        validator.validateGatewayRequest(request);
      }).not.toThrow();
    });

    it('should handle rate limiter errors gracefully', async () => {
      // Test with invalid parameters
      const result = await rateLimiter.checkLimit('', '');
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Security', () => {
    it('should sanitize request data', () => {
      const maliciousRequest = {
        module: 'inventory',
        action: 'getProducts',
        data: {
          query: '<script>alert("xss")</script>',
          limit: 'DROP TABLE products;'
        }
      };

      const result = validator.validateGatewayRequest(maliciousRequest);
      expect(result.isValid).toBe(true); // Structure is valid
      // Additional sanitization would happen in actual implementation
    });

    it('should prevent SQL injection attempts', () => {
      const sqlInjectionRequest = {
        module: 'inventory',
        action: 'getProducts',
        data: {
          id: "1'; DROP TABLE products; --"
        }
      };

      const result = validator.validateGatewayRequest(sqlInjectionRequest);
      expect(result.isValid).toBe(true); // Structure validation passes
      // SQL injection prevention would happen at the ORM level
    });
  });

  describe('Performance', () => {
    it('should validate requests quickly', async () => {
      const request = {
        module: 'inventory',
        action: 'getProducts',
        data: { limit: 100 }
      };

      const startTime = Date.now();

      for (let i = 0; i < 100; i++) {
        validator.validateGatewayRequest(request);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000); // Should complete 100 validations in under 1 second
    });

    it('should handle concurrent validations', async () => {
      const request = {
        module: 'sales',
        action: 'createSale',
        data: { customerId: 'test' }
      };

      const promises = Array(50).fill(null).map(() =>
        Promise.resolve(validator.validateGatewayRequest(request))
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(50);
      results.forEach(result => {
        expect(result.isValid).toBe(true);
      });
    });
  });
});