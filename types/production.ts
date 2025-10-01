// Production System Types

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  version: string;
  isActive: boolean;
  category?: string;
  yieldQuantity: number;
  yieldUnit: string;
  costPerUnit?: number;
  instructions?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  ingredients: RecipeIngredient[];
  versions: RecipeVersion[];
}

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  materialId: string;
  quantity: number;
  unit: string;
  percentage?: number;
  isOptional: boolean;
  notes?: string;
  order: number;
  material: Material;
}

export interface RecipeVersion {
  id: string;
  recipeId: string;
  version: string;
  changes?: string;
  createdAt: Date;
  createdBy?: string;
}

export interface Material {
  id: string;
  name: string;
  description?: string;
  sku: string;
  categoryId: string;
  unitOfMeasure: string;
  costPerUnit: number;
  currentStock: number;
  minimumStock: number;
  maximumStock?: number;
  supplier?: string;
  supplierPrice?: number;
  createdAt: Date;
  updatedAt: Date;
  category: Category;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BOM {
  id: string;
  recipeId: string;
  name: string;
  version: string;
  isActive: boolean;
  totalCost: number;
  createdAt: Date;
  updatedAt: Date;
  items: BOMItem[];
}

export interface BOMItem {
  id: string;
  bomId: string;
  materialId: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  notes?: string;
  material: Material;
}

export interface ProductionBatch {
  id: string;
  batchNumber: string;
  recipeId?: string;
  plannedQuantity: number;
  actualQuantity?: number;
  unit: string;
  status: ProductionStatus;
  startDate: Date;
  endDate?: Date;
  agingStartDate?: Date;
  agingEndDate?: Date;
  agingDays?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  recipe?: Recipe;
  inputs: ProductionInput[];
  outputs: ProductionOutput[];
  qualityControls: QualityControl[];
  wastageRecords: WastageRecord[];
}

export interface ProductionInput {
  id: string;
  batchId: string;
  materialId: string;
  plannedQuantity: number;
  actualQuantity?: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
  notes?: string;
  material: Material;
}

export interface ProductionOutput {
  id: string;
  batchId: string;
  materialId: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
  notes?: string;
  material: Material;
}

export enum ProductionStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  AGING = 'AGING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD'
}

export interface ProcessingStage {
  id: string;
  name: string;
  description?: string;
  order: number;
  duration?: number;
  temperature?: number;
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcessingFlow {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  stages: ProcessingFlowStage[];
}

export interface ProcessingFlowStage {
  id: string;
  flowId: string;
  stageId: string;
  order: number;
  isRequired: boolean;
  stage: ProcessingStage;
}

export interface ProcessingBatch {
  id: string;
  flowId: string;
  currentStageId?: string;
  status: ProcessingStatus;
  startDate: Date;
  endDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  flow: ProcessingFlow;
  currentStage?: ProcessingStage;
  inputs: ProcessingInput[];
  outputs: ProcessingOutput[];
}

export interface ProcessingInput {
  id: string;
  batchId: string;
  materialId: string;
  quantity: number;
  unit: string;
  notes?: string;
  material: Material;
}

export interface ProcessingOutput {
  id: string;
  batchId: string;
  materialId: string;
  quantity: number;
  unit: string;
  notes?: string;
  material: Material;
}

export enum ProcessingStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED'
}

export interface QualityControl {
  id: string;
  batchId: string;
  testType: string;
  testDate: Date;
  result: QualityResult;
  score?: number;
  notes?: string;
  testedBy?: string;
  createdAt: Date;
}

export enum QualityResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
  PENDING = 'PENDING',
  RETEST_REQUIRED = 'RETEST_REQUIRED'
}

export interface WastageRecord {
  id: string;
  batchId?: string;
  materialId?: string;
  quantity: number;
  unit: string;
  reason: string;
  cost: number;
  recordedAt: Date;
  notes?: string;
  createdAt: Date;
}

export interface StockMovement {
  id: string;
  materialId: string;
  type: StockMovementType;
  quantity: number;
  unitCost?: number;
  reference?: string;
  notes?: string;
  createdAt: Date;
  material: Material;
}

export enum StockMovementType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT',
  PRODUCTION_IN = 'PRODUCTION_IN',
  PRODUCTION_OUT = 'PRODUCTION_OUT',
  WASTE = 'WASTE',
  TRANSFER = 'TRANSFER'
}

// Form Types
export interface CreateRecipeData {
  name: string;
  description?: string;
  category?: string;
  yieldQuantity: number;
  yieldUnit: string;
  instructions?: string;
  notes?: string;
  ingredients: CreateRecipeIngredientData[];
}

export interface CreateRecipeIngredientData {
  materialId: string;
  quantity: number;
  unit: string;
  percentage?: number;
  isOptional: boolean;
  notes?: string;
  order: number;
}

export interface CreateProductionBatchData {
  recipeId?: string;
  plannedQuantity: number;
  unit: string;
  startDate: Date;
  notes?: string;
  inputs?: CreateProductionInputData[];
}

export interface CreateProductionInputData {
  materialId: string;
  plannedQuantity: number;
  actualQuantity?: number;
  unit: string;
  costPerUnit: number;
  notes?: string;
}

export interface CreateQualityControlData {
  batchId: string;
  testType: string;
  testDate: Date;
  result: QualityResult;
  score?: number;
  notes?: string;
  testedBy?: string;
}

// Calculation Types
export interface RecipeCalculation {
  totalCost: number;
  costPerUnit: number;
  ingredientCosts: IngredientCost[];
  yield: {
    quantity: number;
    unit: string;
  };
}

export interface IngredientCost {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  percentage: number;
}

export interface YieldAnalysis {
  batchId: string;
  batchNumber: string;
  plannedYield: number;
  actualYield: number;
  yieldPercentage: number;
  variance: number;
  wastage: number;
  notes?: string;
}

// Drag and Drop Types
export interface DraggableIngredient {
  id: string;
  type: 'ingredient';
  material: Material;
  quantity?: number;
  unit?: string;
}

export interface DroppableRecipeZone {
  id: string;
  type: 'recipe-zone';
  accepts: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter and Search Types
export interface RecipeFilters {
  category?: string;
  isActive?: boolean;
  search?: string;
}

export interface ProductionBatchFilters {
  status?: ProductionStatus;
  recipeId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface MaterialFilters {
  categoryId?: string;
  lowStock?: boolean;
  search?: string;
}