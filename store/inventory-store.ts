import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  MaterialWithBatches,
  MaterialBatchWithMaterial,
  StockAlertWithMaterial,
  MaterialFilters,
  BatchFilters,
  StockMovementFilters,
  InventoryStats,
  StockLevel,
  PaginatedResponse,
  CreateMaterialForm,
  CreateMaterialBatchForm,
  StockMovementForm
} from '@/types/inventory'

interface InventoryState {
  // Materials
  materials: MaterialWithBatches[]
  selectedMaterial: MaterialWithBatches | null
  materialFilters: MaterialFilters
  materialsLoading: boolean
  materialsPagination: { page: number; limit: number; total: number; pages: number }

  // Batches
  batches: MaterialBatchWithMaterial[]
  selectedBatch: MaterialBatchWithMaterial | null
  batchFilters: BatchFilters
  batchesLoading: boolean
  batchesPagination: { page: number; limit: number; total: number; pages: number }

  // Stock Alerts
  stockAlerts: StockAlertWithMaterial[]
  alertsLoading: boolean
  unreadAlertsCount: number

  // Inventory Stats
  inventoryStats: InventoryStats | null
  stockLevels: StockLevel[]
  statsLoading: boolean

  // UI State
  sidebarOpen: boolean
  activeTab: string
  searchQuery: string
  bulkSelection: string[]

  // Real-time updates
  lastUpdated: Date | null
  updateInProgress: boolean
}

interface InventoryActions {
  // Materials
  setMaterials: (materials: MaterialWithBatches[]) => void
  addMaterial: (material: MaterialWithBatches) => void
  updateMaterial: (id: string, updates: Partial<MaterialWithBatches>) => void
  deleteMaterial: (id: string) => void
  selectMaterial: (material: MaterialWithBatches | null) => void
  setMaterialFilters: (filters: Partial<MaterialFilters>) => void
  clearMaterialFilters: () => void
  setMaterialsLoading: (loading: boolean) => void
  setMaterialsPagination: (pagination: { page: number; limit: number; total: number; pages: number }) => void

  // Batches
  setBatches: (batches: MaterialBatchWithMaterial[]) => void
  addBatch: (batch: MaterialBatchWithMaterial) => void
  updateBatch: (id: string, updates: Partial<MaterialBatchWithMaterial>) => void
  deleteBatch: (id: string) => void
  selectBatch: (batch: MaterialBatchWithMaterial | null) => void
  setBatchFilters: (filters: Partial<BatchFilters>) => void
  clearBatchFilters: () => void
  setBatchesLoading: (loading: boolean) => void
  setBatchesPagination: (pagination: { page: number; limit: number; total: number; pages: number }) => void

  // Stock Alerts
  setStockAlerts: (alerts: StockAlertWithMaterial[]) => void
  addStockAlert: (alert: StockAlertWithMaterial) => void
  updateStockAlert: (id: string, updates: Partial<StockAlertWithMaterial>) => void
  deleteStockAlert: (id: string) => void
  markAlertAsRead: (id: string) => void
  markAllAlertsAsRead: () => void
  setAlertsLoading: (loading: boolean) => void
  setUnreadAlertsCount: (count: number) => void

  // Inventory Stats
  setInventoryStats: (stats: InventoryStats) => void
  setStockLevels: (levels: StockLevel[]) => void
  setStatsLoading: (loading: boolean) => void

  // UI Actions
  setSidebarOpen: (open: boolean) => void
  setActiveTab: (tab: string) => void
  setSearchQuery: (query: string) => void
  setBulkSelection: (ids: string[]) => void
  addToBulkSelection: (id: string) => void
  removeFromBulkSelection: (id: string) => void
  clearBulkSelection: () => void

  // Real-time updates
  setLastUpdated: (date: Date) => void
  setUpdateInProgress: (inProgress: boolean) => void
  refreshData: () => Promise<void>

  // Bulk operations
  bulkDeleteMaterials: (ids: string[]) => Promise<void>
  bulkUpdateMaterials: (ids: string[], updates: Partial<CreateMaterialForm>) => Promise<void>

  // Unit conversions
  convertUnit: (value: number, fromUnit: string, toUnit: string, materialId?: string) => number

  // Stock operations
  adjustStock: (materialId: string, adjustment: StockMovementForm) => Promise<void>
  transferStock: (fromMaterialId: string, toMaterialId: string, quantity: number) => Promise<void>

  // Utility functions
  getMaterialBysku: (sku: string) => MaterialWithBatches | undefined
  getBatchByNumber: (batchNumber: string) => MaterialBatchWithMaterial | undefined
  getExpiringBatches: (days?: number) => MaterialBatchWithMaterial[]
  getLowStockMaterials: () => MaterialWithBatches[]
}

const defaultMaterialFilters: MaterialFilters = {
  page: 1,
  limit: 20,
  sortBy: 'name',
  sortOrder: 'asc'
}

const defaultBatchFilters: BatchFilters = {
  page: 1,
  limit: 20,
  sortBy: 'receivedDate',
  sortOrder: 'desc'
}

const defaultPagination = {
  page: 1,
  limit: 20,
  total: 0,
  pages: 0
}

export const useInventoryStore = create<InventoryState & InventoryActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        materials: [],
        selectedMaterial: null,
        materialFilters: defaultMaterialFilters,
        materialsLoading: false,
        materialsPagination: defaultPagination,

        batches: [],
        selectedBatch: null,
        batchFilters: defaultBatchFilters,
        batchesLoading: false,
        batchesPagination: defaultPagination,

        stockAlerts: [],
        alertsLoading: false,
        unreadAlertsCount: 0,

        inventoryStats: null,
        stockLevels: [],
        statsLoading: false,

        sidebarOpen: true,
        activeTab: 'materials',
        searchQuery: '',
        bulkSelection: [],

        lastUpdated: null,
        updateInProgress: false,

        // Materials Actions
        setMaterials: (materials) => set({ materials }),

        addMaterial: (material) =>
          set((state) => ({
            materials: [material, ...state.materials]
          })),

        updateMaterial: (id, updates) =>
          set((state) => ({
            materials: state.materials.map((material) =>
              material.id === id ? { ...material, ...updates } : material
            ),
            selectedMaterial:
              state.selectedMaterial?.id === id
                ? { ...state.selectedMaterial, ...updates }
                : state.selectedMaterial
          })),

        deleteMaterial: (id) =>
          set((state) => ({
            materials: state.materials.filter((material) => material.id !== id),
            selectedMaterial:
              state.selectedMaterial?.id === id ? null : state.selectedMaterial,
            bulkSelection: state.bulkSelection.filter((selectedId) => selectedId !== id)
          })),

        selectMaterial: (material) => set({ selectedMaterial: material }),

        setMaterialFilters: (filters) =>
          set((state) => ({
            materialFilters: { ...state.materialFilters, ...filters }
          })),

        clearMaterialFilters: () => set({ materialFilters: defaultMaterialFilters }),
        setMaterialsLoading: (loading) => set({ materialsLoading: loading }),
        setMaterialsPagination: (pagination) => set({ materialsPagination: pagination }),

        // Batches Actions
        setBatches: (batches) => set({ batches }),

        addBatch: (batch) =>
          set((state) => ({
            batches: [batch, ...state.batches]
          })),

        updateBatch: (id, updates) =>
          set((state) => ({
            batches: state.batches.map((batch) =>
              batch.id === id ? { ...batch, ...updates } : batch
            ),
            selectedBatch:
              state.selectedBatch?.id === id
                ? { ...state.selectedBatch, ...updates }
                : state.selectedBatch
          })),

        deleteBatch: (id) =>
          set((state) => ({
            batches: state.batches.filter((batch) => batch.id !== id),
            selectedBatch:
              state.selectedBatch?.id === id ? null : state.selectedBatch
          })),

        selectBatch: (batch) => set({ selectedBatch: batch }),

        setBatchFilters: (filters) =>
          set((state) => ({
            batchFilters: { ...state.batchFilters, ...filters }
          })),

        clearBatchFilters: () => set({ batchFilters: defaultBatchFilters }),
        setBatchesLoading: (loading) => set({ batchesLoading: loading }),
        setBatchesPagination: (pagination) => set({ batchesPagination: pagination }),

        // Stock Alerts Actions
        setStockAlerts: (alerts) =>
          set({
            stockAlerts: alerts,
            unreadAlertsCount: alerts.filter(alert => !alert.isRead).length
          }),

        addStockAlert: (alert) =>
          set((state) => ({
            stockAlerts: [alert, ...state.stockAlerts],
            unreadAlertsCount: alert.isRead ? state.unreadAlertsCount : state.unreadAlertsCount + 1
          })),

        updateStockAlert: (id, updates) =>
          set((state) => {
            const updatedAlerts = state.stockAlerts.map((alert) =>
              alert.id === id ? { ...alert, ...updates } : alert
            )
            return {
              stockAlerts: updatedAlerts,
              unreadAlertsCount: updatedAlerts.filter(alert => !alert.isRead).length
            }
          }),

        deleteStockAlert: (id) =>
          set((state) => {
            const alertToDelete = state.stockAlerts.find(alert => alert.id === id)
            const updatedAlerts = state.stockAlerts.filter((alert) => alert.id !== id)
            return {
              stockAlerts: updatedAlerts,
              unreadAlertsCount: alertToDelete && !alertToDelete.isRead
                ? state.unreadAlertsCount - 1
                : state.unreadAlertsCount
            }
          }),

        markAlertAsRead: (id) =>
          set((state) => ({
            stockAlerts: state.stockAlerts.map((alert) =>
              alert.id === id ? { ...alert, isRead: true } : alert
            ),
            unreadAlertsCount: Math.max(0, state.unreadAlertsCount - 1)
          })),

        markAllAlertsAsRead: () =>
          set((state) => ({
            stockAlerts: state.stockAlerts.map((alert) => ({ ...alert, isRead: true })),
            unreadAlertsCount: 0
          })),

        setAlertsLoading: (loading) => set({ alertsLoading: loading }),
        setUnreadAlertsCount: (count) => set({ unreadAlertsCount: count }),

        // Inventory Stats Actions
        setInventoryStats: (stats) => set({ inventoryStats: stats }),
        setStockLevels: (levels) => set({ stockLevels: levels }),
        setStatsLoading: (loading) => set({ statsLoading: loading }),

        // UI Actions
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setActiveTab: (tab) => set({ activeTab: tab }),
        setSearchQuery: (query) => set({ searchQuery: query }),
        setBulkSelection: (ids) => set({ bulkSelection: ids }),

        addToBulkSelection: (id) =>
          set((state) => ({
            bulkSelection: state.bulkSelection.includes(id)
              ? state.bulkSelection
              : [...state.bulkSelection, id]
          })),

        removeFromBulkSelection: (id) =>
          set((state) => ({
            bulkSelection: state.bulkSelection.filter((selectedId) => selectedId !== id)
          })),

        clearBulkSelection: () => set({ bulkSelection: [] }),

        // Real-time updates
        setLastUpdated: (date) => set({ lastUpdated: date }),
        setUpdateInProgress: (inProgress) => set({ updateInProgress: inProgress }),

        refreshData: async () => {
          // This will be implemented when we create the API calls
          set({ updateInProgress: true })
          try {
            // Refresh materials, batches, alerts, and stats
            // Implementation depends on API structure
          } finally {
            set({
              updateInProgress: false,
              lastUpdated: new Date()
            })
          }
        },

        // Bulk operations
        bulkDeleteMaterials: async (ids) => {
          const { deleteMaterial } = get()
          set({ updateInProgress: true })
          try {
            // API call to bulk delete
            ids.forEach(deleteMaterial)
          } finally {
            set({ updateInProgress: false })
          }
        },

        bulkUpdateMaterials: async (ids, updates) => {
          const { updateMaterial } = get()
          set({ updateInProgress: true })
          try {
            // API call to bulk update
            ids.forEach(id => updateMaterial(id, updates))
          } finally {
            set({ updateInProgress: false })
          }
        },

        // Unit conversions
        convertUnit: (value, fromUnit, toUnit, materialId) => {
          // Standard conversion rates (1 tola = 11.66 grams)
          const conversions: Record<string, Record<string, number>> = {
            gram: {
              kilogram: 0.001,
              tola: 0.085735,
              ml: 1, // Assumes density of 1 g/ml, should be material-specific
            },
            kilogram: {
              gram: 1000,
              tola: 85.735,
            },
            tola: {
              gram: 11.66,
              kilogram: 0.01166,
            },
            ml: {
              liter: 0.001,
              gram: 1, // Assumes density of 1 g/ml, should be material-specific
            },
            liter: {
              ml: 1000,
            }
          }

          const fromUnitLower = fromUnit.toLowerCase()
          const toUnitLower = toUnit.toLowerCase()

          if (fromUnitLower === toUnitLower) return value

          const conversionFactor = conversions[fromUnitLower]?.[toUnitLower]
          if (conversionFactor) {
            return value * conversionFactor
          }

          // If direct conversion not found, try to find material-specific conversion
          // This would require fetching from UnitConversion table
          return value
        },

        // Stock operations
        adjustStock: async (materialId, adjustment) => {
          // Implementation will depend on API structure
          set({ updateInProgress: true })
          try {
            // API call to adjust stock
          } finally {
            set({ updateInProgress: false })
          }
        },

        transferStock: async (fromMaterialId, toMaterialId, quantity) => {
          // Implementation will depend on API structure
          set({ updateInProgress: true })
          try {
            // API call to transfer stock
          } finally {
            set({ updateInProgress: false })
          }
        },

        // Utility functions
        getMaterialBysku: (sku) => {
          const { materials } = get()
          return materials.find(material => material.sku === sku)
        },

        getBatchByNumber: (batchNumber) => {
          const { batches } = get()
          return batches.find(batch => batch.batchNumber === batchNumber)
        },

        getExpiringBatches: (days = 30) => {
          const { batches } = get()
          const cutoffDate = new Date()
          cutoffDate.setDate(cutoffDate.getDate() + days)

          return batches.filter(batch =>
            batch.expiryDate &&
            new Date(batch.expiryDate) <= cutoffDate &&
            !batch.isExpired
          )
        },

        getLowStockMaterials: () => {
          const { materials } = get()
          return materials.filter(material =>
            material.currentStock <= material.reorderLevel
          )
        },
      }),
      {
        name: 'inventory-store',
        partialize: (state) => ({
          materialFilters: state.materialFilters,
          batchFilters: state.batchFilters,
          sidebarOpen: state.sidebarOpen,
          activeTab: state.activeTab,
        }),
      }
    ),
    { name: 'inventory-store' }
  )
)