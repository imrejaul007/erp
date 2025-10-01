import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  data?: any;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface CrossModuleValidationRule {
  id: string;
  sourceModule: string;
  targetModule: string;
  field: string;
  rule: string;
  description: string;
  active: boolean;
}

export interface ValidationContext {
  userId?: string;
  module: string;
  operation: 'create' | 'update' | 'delete';
  skipCrossModule?: boolean;
  skipBusinessRules?: boolean;
}

export class DataValidator {
  private crossModuleRules: Map<string, CrossModuleValidationRule[]> = new Map();

  constructor() {
    this.initializeCrossModuleRules();
  }

  // Core validation method
  async validate(
    data: any,
    schema: z.ZodSchema,
    context: ValidationContext
  ): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    try {
      // Basic schema validation
      const schemaResult = schema.safeParse(data);
      if (!schemaResult.success) {
        result.isValid = false;
        result.errors = schemaResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          value: err.path.reduce((obj, key) => obj?.[key], data)
        }));
      } else {
        result.data = schemaResult.data;
      }

      // Cross-module validation
      if (!context.skipCrossModule && result.isValid) {
        const crossModuleResult = await this.validateCrossModule(data, context);
        result.errors.push(...crossModuleResult.errors);
        result.warnings.push(...crossModuleResult.warnings);
        if (crossModuleResult.errors.length > 0) {
          result.isValid = false;
        }
      }

      // Business rules validation
      if (!context.skipBusinessRules && result.isValid) {
        const businessRulesResult = await this.validateBusinessRules(data, context);
        result.errors.push(...businessRulesResult.errors);
        result.warnings.push(...businessRulesResult.warnings);
        if (businessRulesResult.errors.length > 0) {
          result.isValid = false;
        }
      }

      // Data integrity validation
      if (result.isValid) {
        const integrityResult = await this.validateDataIntegrity(data, context);
        result.errors.push(...integrityResult.errors);
        result.warnings.push(...integrityResult.warnings);
        if (integrityResult.errors.length > 0) {
          result.isValid = false;
        }
      }

      return result;
    } catch (error) {
      console.error('Validation error:', error);
      return {
        isValid: false,
        errors: [{
          field: 'system',
          message: 'Validation system error',
          code: 'SYSTEM_ERROR'
        }],
        warnings: []
      };
    }
  }

  // Gateway request validation
  validateGatewayRequest(request: {
    module: string;
    action: string;
    data: any;
  }): ValidationResult {
    const gatewaySchema = z.object({
      module: z.string().min(1),
      action: z.string().min(1),
      data: z.any()
    });

    const result = gatewaySchema.safeParse(request);
    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        })),
        warnings: []
      };
    }

    const allowedModules = [
      'inventory',
      'sales',
      'crm',
      'finance',
      'production',
      'supply_chain',
      'analytics',
      'ecommerce'
    ];

    if (!allowedModules.includes(request.module)) {
      return {
        isValid: false,
        errors: [{
          field: 'module',
          message: `Invalid module: ${request.module}`,
          code: 'INVALID_MODULE'
        }],
        warnings: []
      };
    }

    return {
      isValid: true,
      errors: [],
      warnings: []
    };
  }

  // Cross-module validation
  private async validateCrossModule(
    data: any,
    context: ValidationContext
  ): Promise<{ errors: ValidationError[]; warnings: ValidationWarning[] }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    try {
      const rules = this.crossModuleRules.get(context.module) || [];

      for (const rule of rules) {
        if (!rule.active) continue;

        const ruleResult = await this.applyCrossModuleRule(data, rule, context);
        errors.push(...ruleResult.errors);
        warnings.push(...ruleResult.warnings);
      }
    } catch (error) {
      console.error('Cross-module validation error:', error);
      errors.push({
        field: 'cross_module',
        message: 'Cross-module validation failed',
        code: 'CROSS_MODULE_ERROR'
      });
    }

    return { errors, warnings };
  }

  private async applyCrossModuleRule(
    data: any,
    rule: CrossModuleValidationRule,
    context: ValidationContext
  ): Promise<{ errors: ValidationError[]; warnings: ValidationWarning[] }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    try {
      switch (rule.rule) {
        case 'reference_exists':
          await this.validateReferenceExists(data, rule, errors);
          break;
        case 'unique_across_modules':
          await this.validateUniqueAcrossModules(data, rule, errors);
          break;
        case 'inventory_availability':
          await this.validateInventoryAvailability(data, rule, errors, warnings);
          break;
        case 'customer_consistency':
          await this.validateCustomerConsistency(data, rule, errors, warnings);
          break;
        case 'financial_consistency':
          await this.validateFinancialConsistency(data, rule, errors, warnings);
          break;
        default:
          warnings.push({
            field: rule.field,
            message: `Unknown cross-module rule: ${rule.rule}`,
            code: 'UNKNOWN_RULE'
          });
      }
    } catch (error) {
      console.error(`Cross-module rule ${rule.rule} error:`, error);
      errors.push({
        field: rule.field,
        message: `Cross-module validation rule failed: ${rule.rule}`,
        code: 'RULE_ERROR'
      });
    }

    return { errors, warnings };
  }

  // Business rules validation
  private async validateBusinessRules(
    data: any,
    context: ValidationContext
  ): Promise<{ errors: ValidationError[]; warnings: ValidationWarning[] }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    try {
      switch (context.module) {
        case 'inventory':
          await this.validateInventoryBusinessRules(data, context, errors, warnings);
          break;
        case 'sales':
          await this.validateSalesBusinessRules(data, context, errors, warnings);
          break;
        case 'crm':
          await this.validateCRMBusinessRules(data, context, errors, warnings);
          break;
        case 'finance':
          await this.validateFinanceBusinessRules(data, context, errors, warnings);
          break;
        case 'production':
          await this.validateProductionBusinessRules(data, context, errors, warnings);
          break;
        default:
          // No specific business rules for this module
          break;
      }
    } catch (error) {
      console.error('Business rules validation error:', error);
      errors.push({
        field: 'business_rules',
        message: 'Business rules validation failed',
        code: 'BUSINESS_RULES_ERROR'
      });
    }

    return { errors, warnings };
  }

  // Data integrity validation
  private async validateDataIntegrity(
    data: any,
    context: ValidationContext
  ): Promise<{ errors: ValidationError[]; warnings: ValidationWarning[] }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    try {
      // Check for data corruption patterns
      if (typeof data === 'object' && data !== null) {
        for (const [key, value] of Object.entries(data)) {
          // Check for suspicious null/undefined patterns
          if (value === null && key.includes('id') && key !== 'parentId') {
            warnings.push({
              field: key,
              message: 'ID field is null, which may cause referential issues',
              code: 'NULL_ID_WARNING',
              value
            });
          }

          // Check for negative values where they shouldn't be
          if (typeof value === 'number' && value < 0) {
            if (key.includes('quantity') || key.includes('amount') || key.includes('price')) {
              errors.push({
                field: key,
                message: 'Negative value not allowed for this field',
                code: 'NEGATIVE_VALUE_ERROR',
                value
              });
            }
          }

          // Check for excessive string lengths
          if (typeof value === 'string' && value.length > 10000) {
            warnings.push({
              field: key,
              message: 'Field value is extremely long, consider truncating',
              code: 'EXCESSIVE_LENGTH_WARNING',
              value: value.substring(0, 100) + '...'
            });
          }
        }
      }

      // Check for circular references
      try {
        JSON.stringify(data);
      } catch (error) {
        if (error.message.includes('circular')) {
          errors.push({
            field: 'data',
            message: 'Circular reference detected in data structure',
            code: 'CIRCULAR_REFERENCE_ERROR'
          });
        }
      }
    } catch (error) {
      console.error('Data integrity validation error:', error);
      errors.push({
        field: 'integrity',
        message: 'Data integrity validation failed',
        code: 'INTEGRITY_ERROR'
      });
    }

    return { errors, warnings };
  }

  // Initialize cross-module validation rules
  private initializeCrossModuleRules() {
    const rules: CrossModuleValidationRule[] = [
      {
        id: 'inventory_product_exists',
        sourceModule: 'sales',
        targetModule: 'inventory',
        field: 'productId',
        rule: 'reference_exists',
        description: 'Product must exist in inventory',
        active: true
      },
      {
        id: 'customer_exists',
        sourceModule: 'sales',
        targetModule: 'crm',
        field: 'customerId',
        rule: 'reference_exists',
        description: 'Customer must exist in CRM',
        active: true
      },
      {
        id: 'inventory_available',
        sourceModule: 'sales',
        targetModule: 'inventory',
        field: 'quantity',
        rule: 'inventory_availability',
        description: 'Sufficient inventory must be available',
        active: true
      },
      {
        id: 'unique_sku',
        sourceModule: 'inventory',
        targetModule: 'inventory',
        field: 'sku',
        rule: 'unique_across_modules',
        description: 'SKU must be unique across all products',
        active: true
      }
    ];

    // Group rules by source module
    for (const rule of rules) {
      if (!this.crossModuleRules.has(rule.sourceModule)) {
        this.crossModuleRules.set(rule.sourceModule, []);
      }
      this.crossModuleRules.get(rule.sourceModule)!.push(rule);
    }
  }

  // Specific validation methods
  private async validateReferenceExists(
    data: any,
    rule: CrossModuleValidationRule,
    errors: ValidationError[]
  ) {
    const fieldValue = data[rule.field];
    if (!fieldValue) return;

    let exists = false;
    switch (rule.targetModule) {
      case 'inventory':
        if (rule.field === 'productId') {
          const product = await prisma.product.findUnique({
            where: { id: fieldValue }
          });
          exists = !!product;
        }
        break;
      case 'crm':
        if (rule.field === 'customerId') {
          const customer = await prisma.customer.findUnique({
            where: { id: fieldValue }
          });
          exists = !!customer;
        }
        break;
    }

    if (!exists) {
      errors.push({
        field: rule.field,
        message: `Referenced ${rule.field} does not exist in ${rule.targetModule}`,
        code: 'REFERENCE_NOT_FOUND',
        value: fieldValue
      });
    }
  }

  private async validateUniqueAcrossModules(
    data: any,
    rule: CrossModuleValidationRule,
    errors: ValidationError[]
  ) {
    const fieldValue = data[rule.field];
    if (!fieldValue) return;

    // This would check uniqueness across multiple tables/modules
    // Implementation depends on specific business requirements
  }

  private async validateInventoryAvailability(
    data: any,
    rule: CrossModuleValidationRule,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ) {
    if (!data.productId || !data.quantity) return;

    try {
      const product = await prisma.product.findUnique({
        where: { id: data.productId },
        include: { inventory: true }
      });

      if (!product || !product.inventory) {
        errors.push({
          field: 'productId',
          message: 'Product not found in inventory',
          code: 'PRODUCT_NOT_FOUND',
          value: data.productId
        });
        return;
      }

      const availableQuantity = product.inventory.quantity;
      const requestedQuantity = data.quantity;

      if (availableQuantity < requestedQuantity) {
        errors.push({
          field: 'quantity',
          message: `Insufficient inventory. Available: ${availableQuantity}, Requested: ${requestedQuantity}`,
          code: 'INSUFFICIENT_INVENTORY',
          value: requestedQuantity
        });
      } else if (availableQuantity - requestedQuantity < product.inventory.minimumStock) {
        warnings.push({
          field: 'quantity',
          message: 'This transaction will cause inventory to fall below minimum stock level',
          code: 'LOW_STOCK_WARNING',
          value: requestedQuantity
        });
      }
    } catch (error) {
      console.error('Inventory availability validation error:', error);
      errors.push({
        field: 'inventory',
        message: 'Failed to validate inventory availability',
        code: 'INVENTORY_CHECK_ERROR'
      });
    }
  }

  private async validateCustomerConsistency(
    data: any,
    rule: CrossModuleValidationRule,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ) {
    // Validate customer data consistency across modules
    // Implementation would check for data conflicts between CRM, Sales, Finance
  }

  private async validateFinancialConsistency(
    data: any,
    rule: CrossModuleValidationRule,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ) {
    // Validate financial data consistency
    // Implementation would check for accounting rules compliance
  }

  // Module-specific business rules
  private async validateInventoryBusinessRules(
    data: any,
    context: ValidationContext,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ) {
    // Inventory-specific business rules
    if (data.quantity !== undefined && data.quantity < 0) {
      errors.push({
        field: 'quantity',
        message: 'Inventory quantity cannot be negative',
        code: 'NEGATIVE_QUANTITY',
        value: data.quantity
      });
    }

    if (data.minimumStock !== undefined && data.quantity !== undefined) {
      if (data.quantity < data.minimumStock) {
        warnings.push({
          field: 'quantity',
          message: 'Current quantity is below minimum stock level',
          code: 'BELOW_MINIMUM_STOCK',
          value: data.quantity
        });
      }
    }
  }

  private async validateSalesBusinessRules(
    data: any,
    context: ValidationContext,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ) {
    // Sales-specific business rules
    if (data.totalAmount !== undefined && data.totalAmount <= 0) {
      errors.push({
        field: 'totalAmount',
        message: 'Sale total amount must be positive',
        code: 'INVALID_TOTAL_AMOUNT',
        value: data.totalAmount
      });
    }

    if (data.discount !== undefined && data.discount > data.totalAmount) {
      errors.push({
        field: 'discount',
        message: 'Discount cannot exceed total amount',
        code: 'EXCESSIVE_DISCOUNT',
        value: data.discount
      });
    }
  }

  private async validateCRMBusinessRules(
    data: any,
    context: ValidationContext,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ) {
    // CRM-specific business rules
    if (data.email && !this.isValidEmail(data.email)) {
      errors.push({
        field: 'email',
        message: 'Invalid email format',
        code: 'INVALID_EMAIL',
        value: data.email
      });
    }
  }

  private async validateFinanceBusinessRules(
    data: any,
    context: ValidationContext,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ) {
    // Finance-specific business rules
    if (data.amount !== undefined && data.amount === 0) {
      warnings.push({
        field: 'amount',
        message: 'Zero amount transaction may not be meaningful',
        code: 'ZERO_AMOUNT_WARNING',
        value: data.amount
      });
    }
  }

  private async validateProductionBusinessRules(
    data: any,
    context: ValidationContext,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ) {
    // Production-specific business rules
    if (data.productionDate && data.expectedCompletionDate) {
      if (new Date(data.productionDate) > new Date(data.expectedCompletionDate)) {
        errors.push({
          field: 'expectedCompletionDate',
          message: 'Expected completion date cannot be before production start date',
          code: 'INVALID_COMPLETION_DATE',
          value: data.expectedCompletionDate
        });
      }
    }
  }

  // Utility methods
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Public methods for managing validation rules
  public async addCrossModuleRule(rule: Omit<CrossModuleValidationRule, 'id'>): Promise<string> {
    const id = `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newRule = { ...rule, id };

    if (!this.crossModuleRules.has(rule.sourceModule)) {
      this.crossModuleRules.set(rule.sourceModule, []);
    }
    this.crossModuleRules.get(rule.sourceModule)!.push(newRule);

    return id;
  }

  public getCrossModuleRules(module?: string): CrossModuleValidationRule[] {
    if (module) {
      return this.crossModuleRules.get(module) || [];
    }
    return Array.from(this.crossModuleRules.values()).flat();
  }

  public updateCrossModuleRule(id: string, updates: Partial<CrossModuleValidationRule>): boolean {
    for (const rules of this.crossModuleRules.values()) {
      const ruleIndex = rules.findIndex(rule => rule.id === id);
      if (ruleIndex !== -1) {
        rules[ruleIndex] = { ...rules[ruleIndex], ...updates };
        return true;
      }
    }
    return false;
  }
}