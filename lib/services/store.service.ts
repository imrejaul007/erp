import { prisma } from '@/lib/database/prisma';
import { StoreData, AuthResponse } from '@/types/auth';
import { AuditService } from './audit.service';

export class StoreService {
  private auditService: AuditService;

  constructor() {
    this.auditService = new AuditService();
  }

  /**
   * Create a new store
   */
  async createStore(storeData: StoreData, createdBy: string): Promise<AuthResponse> {
    try {
      // Check if store code already exists
      const existingStore = await prisma.store.findUnique({
        where: { code: storeData.code },
      });

      if (existingStore) {
        return {
          success: false,
          message: 'Store code already exists',
          messageArabic: 'رمز المتجر موجود بالفعل',
        };
      }

      const store = await prisma.store.create({
        data: {
          code: storeData.code,
          name: storeData.name,
          nameArabic: storeData.nameArabic,
          address: storeData.address,
          city: storeData.city,
          state: storeData.state,
          postalCode: storeData.postalCode,
          country: storeData.country,
          phone: storeData.phone,
          email: storeData.email,
          manager: storeData.manager,
          timezone: storeData.timezone,
          currency: storeData.currency,
        },
      });

      // If a manager is assigned, give them access to this store
      if (storeData.manager) {
        await this.assignUserToStore(storeData.manager, store.id, false, createdBy);
      }

      // Log store creation
      await this.auditService.log({
        userId: createdBy,
        action: 'USER_CREATE',
        resource: 'stores',
        resourceId: store.id,
        newValues: storeData,
        ipAddress: 'unknown',
        userAgent: 'unknown',
      });

      return {
        success: true,
        message: 'Store created successfully',
        messageArabic: 'تم إنشاء المتجر بنجاح',
      };
    } catch (error) {
      console.error('Create store error:', error);
      return {
        success: false,
        message: 'Failed to create store',
        messageArabic: 'فشل في إنشاء المتجر',
      };
    }
  }

  /**
   * Update store
   */
  async updateStore(storeId: string, storeData: Partial<StoreData>, updatedBy: string): Promise<AuthResponse> {
    try {
      const existingStore = await prisma.store.findUnique({
        where: { id: storeId },
      });

      if (!existingStore) {
        return {
          success: false,
          message: 'Store not found',
          messageArabic: 'المتجر غير موجود',
        };
      }

      // Check if store code is being changed and already exists
      if (storeData.code && storeData.code !== existingStore.code) {
        const codeExists = await prisma.store.findUnique({
          where: { code: storeData.code },
        });

        if (codeExists) {
          return {
            success: false,
            message: 'Store code already exists',
            messageArabic: 'رمز المتجر موجود بالفعل',
          };
        }
      }

      const updatedStore = await prisma.store.update({
        where: { id: storeId },
        data: {
          code: storeData.code,
          name: storeData.name,
          nameArabic: storeData.nameArabic,
          address: storeData.address,
          city: storeData.city,
          state: storeData.state,
          postalCode: storeData.postalCode,
          country: storeData.country,
          phone: storeData.phone,
          email: storeData.email,
          manager: storeData.manager,
          timezone: storeData.timezone,
          currency: storeData.currency,
        },
      });

      // Handle manager changes
      if (storeData.manager !== undefined) {
        // Remove previous manager's default store access if changed
        if (existingStore.manager && existingStore.manager !== storeData.manager) {
          await prisma.userStore.updateMany({
            where: {
              userId: existingStore.manager,
              storeId,
              isDefault: true,
            },
            data: { isDefault: false },
          });
        }

        // Assign new manager if provided
        if (storeData.manager) {
          await this.assignUserToStore(storeData.manager, storeId, true, updatedBy);
        }
      }

      // Log store update
      await this.auditService.log({
        userId: updatedBy,
        storeId,
        action: 'USER_UPDATE',
        resource: 'stores',
        resourceId: storeId,
        oldValues: {
          name: existingStore.name,
          manager: existingStore.manager,
        },
        newValues: storeData,
        ipAddress: 'unknown',
        userAgent: 'unknown',
      });

      return {
        success: true,
        message: 'Store updated successfully',
        messageArabic: 'تم تحديث المتجر بنجاح',
      };
    } catch (error) {
      console.error('Update store error:', error);
      return {
        success: false,
        message: 'Failed to update store',
        messageArabic: 'فشل في تحديث المتجر',
      };
    }
  }

  /**
   * Delete store
   */
  async deleteStore(storeId: string, deletedBy: string): Promise<AuthResponse> {
    try {
      const store = await prisma.store.findUnique({
        where: { id: storeId },
        include: {
          userStores: true,
        },
      });

      if (!store) {
        return {
          success: false,
          message: 'Store not found',
          messageArabic: 'المتجر غير موجود',
        };
      }

      // Check if store has associated data (you might want to add more checks)
      // For now, we'll just soft delete by deactivating
      await prisma.store.update({
        where: { id: storeId },
        data: { isActive: false },
      });

      // Log store deletion
      await this.auditService.log({
        userId: deletedBy,
        storeId,
        action: 'USER_DELETE',
        resource: 'stores',
        resourceId: storeId,
        oldValues: {
          name: store.name,
          code: store.code,
        },
        ipAddress: 'unknown',
        userAgent: 'unknown',
      });

      return {
        success: true,
        message: 'Store deleted successfully',
        messageArabic: 'تم حذف المتجر بنجاح',
      };
    } catch (error) {
      console.error('Delete store error:', error);
      return {
        success: false,
        message: 'Failed to delete store',
        messageArabic: 'فشل في حذف المتجر',
      };
    }
  }

  /**
   * Get all stores
   */
  async getStores(includeInactive: boolean = false) {
    return await prisma.store.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        userStores: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            userStores: true,
            auditLogs: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get store by ID
   */
  async getStoreById(storeId: string) {
    return await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        userStores: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        roleStores: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                displayName: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Assign user to store
   */
  async assignUserToStore(
    userId: string,
    storeId: string,
    isDefault: boolean = false,
    assignedBy: string
  ): Promise<AuthResponse> {
    try {
      // Check if assignment already exists
      const existingAssignment = await prisma.userStore.findUnique({
        where: {
          userId_storeId: { userId, storeId },
        },
      });

      if (existingAssignment) {
        // Update existing assignment
        await prisma.userStore.update({
          where: { id: existingAssignment.id },
          data: {
            canAccess: true,
            isDefault,
          },
        });
      } else {
        // Create new assignment
        await prisma.userStore.create({
          data: {
            userId,
            storeId,
            isDefault,
            canAccess: true,
          },
        });
      }

      // If this is set as default, remove default from other stores for this user
      if (isDefault) {
        await prisma.userStore.updateMany({
          where: {
            userId,
            storeId: { not: storeId },
            isDefault: true,
          },
          data: { isDefault: false },
        });
      }

      // Log store assignment
      await this.auditService.log({
        userId: assignedBy,
        storeId,
        action: 'USER_UPDATE',
        resource: 'user_stores',
        metadata: {
          targetUserId: userId,
          action: 'assigned',
          isDefault,
        },
        ipAddress: 'unknown',
        userAgent: 'unknown',
      });

      return {
        success: true,
        message: 'User assigned to store successfully',
        messageArabic: 'تم تعيين المستخدم للمتجر بنجاح',
      };
    } catch (error) {
      console.error('Assign user to store error:', error);
      return {
        success: false,
        message: 'Failed to assign user to store',
        messageArabic: 'فشل في تعيين المستخدم للمتجر',
      };
    }
  }

  /**
   * Remove user from store
   */
  async removeUserFromStore(userId: string, storeId: string, removedBy: string): Promise<AuthResponse> {
    try {
      const assignment = await prisma.userStore.findUnique({
        where: {
          userId_storeId: { userId, storeId },
        },
      });

      if (!assignment) {
        return {
          success: false,
          message: 'User is not assigned to this store',
          messageArabic: 'المستخدم غير مُعيّن لهذا المتجر',
        };
      }

      // Remove access
      await prisma.userStore.update({
        where: { id: assignment.id },
        data: { canAccess: false },
      });

      // Log store removal
      await this.auditService.log({
        userId: removedBy,
        storeId,
        action: 'USER_UPDATE',
        resource: 'user_stores',
        metadata: {
          targetUserId: userId,
          action: 'removed',
        },
        ipAddress: 'unknown',
        userAgent: 'unknown',
      });

      return {
        success: true,
        message: 'User removed from store successfully',
        messageArabic: 'تم إزالة المستخدم من المتجر بنجاح',
      };
    } catch (error) {
      console.error('Remove user from store error:', error);
      return {
        success: false,
        message: 'Failed to remove user from store',
        messageArabic: 'فشل في إزالة المستخدم من المتجر',
      };
    }
  }

  /**
   * Get user's accessible stores
   */
  async getUserStores(userId: string) {
    return await prisma.userStore.findMany({
      where: {
        userId,
        canAccess: true,
      },
      include: {
        store: true,
      },
      orderBy: [
        { isDefault: 'desc' },
        { store: { name: 'asc' } },
      ],
    });
  }

  /**
   * Set user's default store
   */
  async setDefaultStore(userId: string, storeId: string): Promise<AuthResponse> {
    try {
      // Check if user has access to this store
      const userStore = await prisma.userStore.findUnique({
        where: {
          userId_storeId: { userId, storeId },
        },
      });

      if (!userStore || !userStore.canAccess) {
        return {
          success: false,
          message: 'User does not have access to this store',
          messageArabic: 'المستخدم ليس لديه وصول لهذا المتجر',
        };
      }

      // Remove default from all stores for this user
      await prisma.userStore.updateMany({
        where: { userId },
        data: { isDefault: false },
      });

      // Set new default
      await prisma.userStore.update({
        where: { id: userStore.id },
        data: { isDefault: true },
      });

      return {
        success: true,
        message: 'Default store updated successfully',
        messageArabic: 'تم تحديث المتجر الافتراضي بنجاح',
      };
    } catch (error) {
      console.error('Set default store error:', error);
      return {
        success: false,
        message: 'Failed to set default store',
        messageArabic: 'فشل في تعيين المتجر الافتراضي',
      };
    }
  }

  /**
   * Get store hierarchy (for multi-level store management)
   */
  async getStoreHierarchy() {
    const stores = await this.getStores();

    // Group stores by region/area (you can customize this logic)
    const hierarchy = stores.reduce((acc, store) => {
      const region = store.state || 'Unknown';
      if (!acc[region]) {
        acc[region] = [];
      }
      acc[region].push(store);
      return acc;
    }, {} as Record<string, any[]>);

    return hierarchy;
  }

  /**
   * Get store statistics
   */
  async getStoreStatistics(storeId?: string) {
    const where = storeId ? { storeId } : {};

    const [
      totalStores,
      activeStores,
      totalUsers,
      storeUserCounts,
    ] = await Promise.all([
      // Total stores
      prisma.store.count(),

      // Active stores
      prisma.store.count({ where: { isActive: true } }),

      // Total users with store access
      prisma.userStore.count({
        where: { ...where, canAccess: true },
      }),

      // Users per store
      prisma.userStore.groupBy({
        by: ['storeId'],
        where: { ...where, canAccess: true },
        _count: true,
      }),
    ]);

    const averageUsersPerStore = storeUserCounts.length > 0
      ? storeUserCounts.reduce((sum, store) => sum + store._count, 0) / storeUserCounts.length
      : 0;

    return {
      totalStores,
      activeStores,
      totalUsers,
      averageUsersPerStore,
      storeUserDistribution: storeUserCounts,
    };
  }

  /**
   * Validate store access for user
   */
  async validateStoreAccess(userId: string, storeId: string): Promise<boolean> {
    const userStore = await prisma.userStore.findUnique({
      where: {
        userId_storeId: { userId, storeId },
      },
    });

    return userStore?.canAccess || false;
  }

  /**
   * Get cross-store access permissions
   */
  async getCrossStorePermissions(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          where: { isActive: true },
          include: {
            role: {
              include: {
                roleStores: {
                  include: {
                    store: true,
                  },
                },
              },
            },
          },
        },
        userStores: {
          where: { canAccess: true },
          include: {
            store: true,
          },
        },
      },
    });

    if (!user) return null;

    // Get stores accessible through roles
    const roleStores = user.userRoles
      .flatMap(ur => ur.role.roleStores)
      .map(rs => rs.store);

    // Get directly assigned stores
    const directStores = user.userStores.map(us => us.store);

    // Combine and deduplicate
    const allStores = [...roleStores, ...directStores]
      .filter((store, index, self) =>
        index === self.findIndex(s => s.id === store.id)
      );

    return {
      user,
      accessibleStores: allStores,
      defaultStore: user.userStores.find(us => us.isDefault)?.store,
      hasMultiStoreAccess: allStores.length > 1,
    };
  }

  /**
   * Bulk assign users to store
   */
  async bulkAssignUsersToStore(
    userIds: string[],
    storeId: string,
    assignedBy: string
  ): Promise<AuthResponse> {
    try {
      const store = await prisma.store.findUnique({
        where: { id: storeId },
      });

      if (!store) {
        return {
          success: false,
          message: 'Store not found',
          messageArabic: 'المتجر غير موجود',
        };
      }

      // Create assignments for users who don't already have them
      for (const userId of userIds) {
        await this.assignUserToStore(userId, storeId, false, assignedBy);
      }

      return {
        success: true,
        message: `${userIds.length} users assigned to store successfully`,
        messageArabic: `تم تعيين ${userIds.length} مستخدم للمتجر بنجاح`,
      };
    } catch (error) {
      console.error('Bulk assign users error:', error);
      return {
        success: false,
        message: 'Failed to assign users to store',
        messageArabic: 'فشل في تعيين المستخدمين للمتجر',
      };
    }
  }
}