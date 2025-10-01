import { prisma } from '@/lib/database/prisma';
import { RoleData, PermissionData, UserRoleAssignment, AuthResponse } from '@/types/auth';
import { PermissionAction, PermissionResource, UserRole } from '@prisma/client';
import { AuditService } from './audit.service';

export class RBACService {
  private auditService: AuditService;

  constructor() {
    this.auditService = new AuditService();
  }

  /**
   * Create a new role
   */
  async createRole(roleData: RoleData, createdBy: string): Promise<AuthResponse> {
    try {
      // Check if role name already exists
      const existingRole = await prisma.role.findUnique({
        where: { name: roleData.name },
      });

      if (existingRole) {
        return {
          success: false,
          message: 'Role already exists',
          messageArabic: 'الدور موجود بالفعل',
        };
      }

      // Create role
      const role = await prisma.role.create({
        data: {
          name: roleData.name,
          displayName: roleData.displayName,
          displayNameArabic: roleData.displayNameArabic,
          description: roleData.description,
          descriptionArabic: roleData.descriptionArabic,
          color: roleData.color,
        },
      });

      // Assign permissions
      if (roleData.permissions.length > 0) {
        await this.assignPermissionsToRole(role.id, roleData.permissions, createdBy);
      }

      // Assign to stores if specified
      if (roleData.stores && roleData.stores.length > 0) {
        await prisma.roleStore.createMany({
          data: roleData.stores.map(storeId => ({
            roleId: role.id,
            storeId,
          })),
        });
      }

      // Log role creation
      await this.auditService.log({
        userId: createdBy,
        action: 'USER_CREATE',
        resource: 'roles',
        resourceId: role.id,
        newValues: roleData,
        ipAddress: 'unknown',
        userAgent: 'unknown',
      });

      return {
        success: true,
        message: 'Role created successfully',
        messageArabic: 'تم إنشاء الدور بنجاح',
      };
    } catch (error) {
      console.error('Create role error:', error);
      return {
        success: false,
        message: 'Failed to create role',
        messageArabic: 'فشل في إنشاء الدور',
      };
    }
  }

  /**
   * Update role
   */
  async updateRole(roleId: string, roleData: Partial<RoleData>, updatedBy: string): Promise<AuthResponse> {
    try {
      const existingRole = await prisma.role.findUnique({
        where: { id: roleId },
        include: {
          permissions: {
            include: { permission: true },
          },
          roleStores: true,
        },
      });

      if (!existingRole) {
        return {
          success: false,
          message: 'Role not found',
          messageArabic: 'الدور غير موجود',
        };
      }

      // Check if it's a system role
      if (existingRole.isSystem) {
        return {
          success: false,
          message: 'Cannot modify system role',
          messageArabic: 'لا يمكن تعديل دور النظام',
        };
      }

      // Update basic role info
      const updatedRole = await prisma.role.update({
        where: { id: roleId },
        data: {
          displayName: roleData.displayName,
          displayNameArabic: roleData.displayNameArabic,
          description: roleData.description,
          descriptionArabic: roleData.descriptionArabic,
          color: roleData.color,
        },
      });

      // Update permissions if provided
      if (roleData.permissions) {
        // Remove existing permissions
        await prisma.rolePermission.deleteMany({
          where: { roleId },
        });

        // Add new permissions
        if (roleData.permissions.length > 0) {
          await this.assignPermissionsToRole(roleId, roleData.permissions, updatedBy);
        }
      }

      // Update store assignments if provided
      if (roleData.stores) {
        // Remove existing store assignments
        await prisma.roleStore.deleteMany({
          where: { roleId },
        });

        // Add new store assignments
        if (roleData.stores.length > 0) {
          await prisma.roleStore.createMany({
            data: roleData.stores.map(storeId => ({
              roleId,
              storeId,
            })),
          });
        }
      }

      // Log role update
      await this.auditService.log({
        userId: updatedBy,
        action: 'USER_UPDATE',
        resource: 'roles',
        resourceId: roleId,
        oldValues: {
          displayName: existingRole.displayName,
          permissions: existingRole.permissions.map(p => p.permission.id),
          stores: existingRole.roleStores.map(rs => rs.storeId),
        },
        newValues: roleData,
        ipAddress: 'unknown',
        userAgent: 'unknown',
      });

      return {
        success: true,
        message: 'Role updated successfully',
        messageArabic: 'تم تحديث الدور بنجاح',
      };
    } catch (error) {
      console.error('Update role error:', error);
      return {
        success: false,
        message: 'Failed to update role',
        messageArabic: 'فشل في تحديث الدور',
      };
    }
  }

  /**
   * Delete role
   */
  async deleteRole(roleId: string, deletedBy: string): Promise<AuthResponse> {
    try {
      const role = await prisma.role.findUnique({
        where: { id: roleId },
        include: {
          userRoles: true,
        },
      });

      if (!role) {
        return {
          success: false,
          message: 'Role not found',
          messageArabic: 'الدور غير موجود',
        };
      }

      // Check if it's a system role
      if (role.isSystem) {
        return {
          success: false,
          message: 'Cannot delete system role',
          messageArabic: 'لا يمكن حذف دور النظام',
        };
      }

      // Check if role is assigned to users
      if (role.userRoles.length > 0) {
        return {
          success: false,
          message: 'Cannot delete role that is assigned to users',
          messageArabic: 'لا يمكن حذف دور مُعيّن للمستخدمين',
        };
      }

      // Delete role (cascading will handle permissions and store assignments)
      await prisma.role.delete({
        where: { id: roleId },
      });

      // Log role deletion
      await this.auditService.log({
        userId: deletedBy,
        action: 'USER_DELETE',
        resource: 'roles',
        resourceId: roleId,
        oldValues: { name: role.name, displayName: role.displayName },
        ipAddress: 'unknown',
        userAgent: 'unknown',
      });

      return {
        success: true,
        message: 'Role deleted successfully',
        messageArabic: 'تم حذف الدور بنجاح',
      };
    } catch (error) {
      console.error('Delete role error:', error);
      return {
        success: false,
        message: 'Failed to delete role',
        messageArabic: 'فشل في حذف الدور',
      };
    }
  }

  /**
   * Get all roles with permissions
   */
  async getRoles(includeSystem: boolean = true) {
    return await prisma.role.findMany({
      where: includeSystem ? {} : { isSystem: false },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        roleStores: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
        userRoles: {
          where: { isActive: true },
          select: { userId: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get role by ID
   */
  async getRoleById(roleId: string) {
    return await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        roleStores: {
          include: {
            store: true,
          },
        },
        userRoles: {
          where: { isActive: true },
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
      },
    });
  }

  /**
   * Create permission
   */
  async createPermission(permissionData: PermissionData, createdBy: string): Promise<AuthResponse> {
    try {
      // Check if permission already exists
      const existingPermission = await prisma.permission.findUnique({
        where: {
          action_resource: {
            action: permissionData.action,
            resource: permissionData.resource,
          },
        },
      });

      if (existingPermission) {
        return {
          success: false,
          message: 'Permission already exists',
          messageArabic: 'الصلاحية موجودة بالفعل',
        };
      }

      const permission = await prisma.permission.create({
        data: permissionData,
      });

      // Log permission creation
      await this.auditService.log({
        userId: createdBy,
        action: 'USER_CREATE',
        resource: 'permissions',
        resourceId: permission.id,
        newValues: permissionData,
        ipAddress: 'unknown',
        userAgent: 'unknown',
      });

      return {
        success: true,
        message: 'Permission created successfully',
        messageArabic: 'تم إنشاء الصلاحية بنجاح',
      };
    } catch (error) {
      console.error('Create permission error:', error);
      return {
        success: false,
        message: 'Failed to create permission',
        messageArabic: 'فشل في إنشاء الصلاحية',
      };
    }
  }

  /**
   * Get all permissions
   */
  async getPermissions() {
    return await prisma.permission.findMany({
      where: { isActive: true },
      orderBy: [{ resource: 'asc' }, { action: 'asc' }],
    });
  }

  /**
   * Assign role to user
   */
  async assignRoleToUser(userId: string, roleId: string, assignedBy: string): Promise<AuthResponse> {
    try {
      // Check if assignment already exists
      const existingAssignment = await prisma.userRoleAssignment.findUnique({
        where: {
          userId_roleId: { userId, roleId },
        },
      });

      if (existingAssignment) {
        if (existingAssignment.isActive) {
          return {
            success: false,
            message: 'User already has this role',
            messageArabic: 'المستخدم لديه هذا الدور بالفعل',
          };
        } else {
          // Reactivate existing assignment
          await prisma.userRoleAssignment.update({
            where: { id: existingAssignment.id },
            data: {
              isActive: true,
              assignedBy,
            },
          });
        }
      } else {
        // Create new assignment
        await prisma.userRoleAssignment.create({
          data: {
            userId,
            roleId,
            assignedBy,
            isActive: true,
          },
        });
      }

      // Log role assignment
      await this.auditService.logRoleAssignment({
        userId: assignedBy,
        targetUserId: userId,
        roleId,
        action: 'assign',
        ipAddress: 'unknown',
        userAgent: 'unknown',
      });

      return {
        success: true,
        message: 'Role assigned successfully',
        messageArabic: 'تم تعيين الدور بنجاح',
      };
    } catch (error) {
      console.error('Assign role error:', error);
      return {
        success: false,
        message: 'Failed to assign role',
        messageArabic: 'فشل في تعيين الدور',
      };
    }
  }

  /**
   * Remove role from user
   */
  async removeRoleFromUser(userId: string, roleId: string, removedBy: string): Promise<AuthResponse> {
    try {
      const assignment = await prisma.userRoleAssignment.findUnique({
        where: {
          userId_roleId: { userId, roleId },
        },
      });

      if (!assignment || !assignment.isActive) {
        return {
          success: false,
          message: 'User does not have this role',
          messageArabic: 'المستخدم ليس لديه هذا الدور',
        };
      }

      // Deactivate assignment
      await prisma.userRoleAssignment.update({
        where: { id: assignment.id },
        data: { isActive: false },
      });

      // Log role removal
      await this.auditService.logRoleAssignment({
        userId: removedBy,
        targetUserId: userId,
        roleId,
        action: 'remove',
        ipAddress: 'unknown',
        userAgent: 'unknown',
      });

      return {
        success: true,
        message: 'Role removed successfully',
        messageArabic: 'تم إزالة الدور بنجاح',
      };
    } catch (error) {
      console.error('Remove role error:', error);
      return {
        success: false,
        message: 'Failed to remove role',
        messageArabic: 'فشل في إزالة الدور',
      };
    }
  }

  /**
   * Get user roles and permissions
   */
  async getUserRolesAndPermissions(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          where: { isActive: true },
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) return null;

    const roles = user.userRoles.map(ur => ur.role);
    const permissions = user.userRoles
      .flatMap(ur => ur.role.permissions)
      .map(rp => ({
        id: rp.permission.id,
        action: rp.permission.action,
        resource: rp.permission.resource,
        conditions: rp.conditions || rp.permission.conditions,
      }));

    // Remove duplicate permissions
    const uniquePermissions = permissions.filter((permission, index, self) =>
      index === self.findIndex(p => p.action === permission.action && p.resource === permission.resource)
    );

    return {
      roles,
      permissions: uniquePermissions,
    };
  }

  /**
   * Check if user has permission
   */
  async hasPermission(
    userId: string,
    action: PermissionAction,
    resource: PermissionResource,
    conditions?: Record<string, any>
  ): Promise<boolean> {
    const userPermissions = await this.getUserRolesAndPermissions(userId);
    if (!userPermissions) return false;

    // Check if user has the permission
    const hasBasicPermission = userPermissions.permissions.some(
      p => p.action === action && p.resource === resource
    );

    if (!hasBasicPermission) return false;

    // TODO: Implement condition checking
    // This would involve evaluating conditions like time-based access,
    // location-based access, etc.

    return true;
  }

  /**
   * Check if user has role
   */
  async hasRole(userId: string, roleName: string | UserRole): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          where: { isActive: true },
          include: { role: true },
        },
      },
    });

    if (!user) return false;

    // Check primary role
    if (user.role.toString() === roleName.toString()) return true;

    // Check assigned roles
    return user.userRoles.some(ur => ur.role.name === roleName);
  }

  /**
   * Get role hierarchy
   */
  async getRoleHierarchy(): Promise<Array<{ role: string; level: number; permissions: number }>> {
    const roleHierarchy = [
      { role: 'OWNER', level: 10 },
      { role: 'ADMIN', level: 9 },
      { role: 'MANAGER', level: 8 },
      { role: 'ACCOUNTANT', level: 7 },
      { role: 'SALES', level: 6 },
      { role: 'INVENTORY', level: 5 },
      { role: 'CUSTOMER', level: 2 },
      { role: 'USER', level: 1 },
    ];

    const roles = await this.getRoles();

    return roleHierarchy.map(rh => {
      const role = roles.find(r => r.name === rh.role);
      return {
        role: rh.role,
        level: rh.level,
        permissions: role?.permissions.length || 0,
      };
    });
  }

  /**
   * Initialize default roles and permissions
   */
  async initializeDefaultRoles(): Promise<void> {
    try {
      // Define default permissions
      const defaultPermissions = [
        // User management
        { action: 'CREATE', resource: 'USERS' },
        { action: 'READ', resource: 'USERS' },
        { action: 'UPDATE', resource: 'USERS' },
        { action: 'DELETE', resource: 'USERS' },

        // Role management
        { action: 'CREATE', resource: 'ROLES' },
        { action: 'READ', resource: 'ROLES' },
        { action: 'UPDATE', resource: 'ROLES' },
        { action: 'DELETE', resource: 'ROLES' },

        // Product management
        { action: 'CREATE', resource: 'PRODUCTS' },
        { action: 'READ', resource: 'PRODUCTS' },
        { action: 'UPDATE', resource: 'PRODUCTS' },
        { action: 'DELETE', resource: 'PRODUCTS' },

        // Inventory management
        { action: 'CREATE', resource: 'INVENTORY' },
        { action: 'READ', resource: 'INVENTORY' },
        { action: 'UPDATE', resource: 'INVENTORY' },
        { action: 'DELETE', resource: 'INVENTORY' },

        // Order management
        { action: 'CREATE', resource: 'ORDERS' },
        { action: 'READ', resource: 'ORDERS' },
        { action: 'UPDATE', resource: 'ORDERS' },
        { action: 'DELETE', resource: 'ORDERS' },
        { action: 'APPROVE', resource: 'ORDERS' },

        // Customer management
        { action: 'CREATE', resource: 'CUSTOMERS' },
        { action: 'READ', resource: 'CUSTOMERS' },
        { action: 'UPDATE', resource: 'CUSTOMERS' },
        { action: 'DELETE', resource: 'CUSTOMERS' },

        // Supplier management
        { action: 'CREATE', resource: 'SUPPLIERS' },
        { action: 'READ', resource: 'SUPPLIERS' },
        { action: 'UPDATE', resource: 'SUPPLIERS' },
        { action: 'DELETE', resource: 'SUPPLIERS' },

        // Reports
        { action: 'READ', resource: 'REPORTS' },
        { action: 'EXPORT', resource: 'REPORTS' },

        // Financial
        { action: 'READ', resource: 'FINANCIALS' },
        { action: 'UPDATE', resource: 'FINANCIALS' },
        { action: 'APPROVE', resource: 'FINANCIALS' },

        // Settings
        { action: 'READ', resource: 'SETTINGS' },
        { action: 'UPDATE', resource: 'SETTINGS' },

        // Stores
        { action: 'CREATE', resource: 'STORES' },
        { action: 'READ', resource: 'STORES' },
        { action: 'UPDATE', resource: 'STORES' },
        { action: 'DELETE', resource: 'STORES' },

        // Audit logs
        { action: 'READ', resource: 'AUDIT_LOGS' },
        { action: 'AUDIT', resource: 'AUDIT_LOGS' },
      ];

      // Create permissions
      for (const perm of defaultPermissions) {
        await prisma.permission.upsert({
          where: {
            action_resource: {
              action: perm.action as PermissionAction,
              resource: perm.resource as PermissionResource,
            },
          },
          create: {
            action: perm.action as PermissionAction,
            resource: perm.resource as PermissionResource,
            description: `${perm.action} ${perm.resource}`,
          },
          update: {},
        });
      }

      // Define default roles with their permissions
      const defaultRoles = [
        {
          name: 'owner',
          displayName: 'Owner',
          displayNameArabic: 'المالك',
          description: 'Full system access',
          descriptionArabic: 'وصول كامل للنظام',
          isSystem: true,
          permissions: defaultPermissions, // All permissions
        },
        {
          name: 'admin',
          displayName: 'Administrator',
          displayNameArabic: 'المدير',
          description: 'System administration',
          descriptionArabic: 'إدارة النظام',
          isSystem: true,
          permissions: defaultPermissions.filter(p =>
            !['DELETE', 'AUDIT'].includes(p.action) || p.resource !== 'USERS'
          ),
        },
        {
          name: 'manager',
          displayName: 'Manager',
          displayNameArabic: 'المدير',
          description: 'Store management',
          descriptionArabic: 'إدارة المتجر',
          isSystem: true,
          permissions: defaultPermissions.filter(p =>
            ['READ', 'CREATE', 'UPDATE', 'APPROVE'].includes(p.action)
          ),
        },
        {
          name: 'sales',
          displayName: 'Sales Staff',
          displayNameArabic: 'موظف مبيعات',
          description: 'Sales operations',
          descriptionArabic: 'عمليات المبيعات',
          isSystem: true,
          permissions: defaultPermissions.filter(p =>
            (p.resource === 'ORDERS' && ['CREATE', 'READ', 'UPDATE'].includes(p.action)) ||
            (p.resource === 'CUSTOMERS' && ['CREATE', 'READ', 'UPDATE'].includes(p.action)) ||
            (p.resource === 'PRODUCTS' && p.action === 'READ') ||
            (p.resource === 'INVENTORY' && p.action === 'READ')
          ),
        },
        {
          name: 'inventory',
          displayName: 'Inventory Staff',
          displayNameArabic: 'موظف مخزون',
          description: 'Inventory management',
          descriptionArabic: 'إدارة المخزون',
          isSystem: true,
          permissions: defaultPermissions.filter(p =>
            (p.resource === 'INVENTORY' && ['CREATE', 'READ', 'UPDATE'].includes(p.action)) ||
            (p.resource === 'PRODUCTS' && ['CREATE', 'READ', 'UPDATE'].includes(p.action)) ||
            (p.resource === 'SUPPLIERS' && ['CREATE', 'READ', 'UPDATE'].includes(p.action))
          ),
        },
      ];

      // Create roles
      for (const roleData of defaultRoles) {
        const role = await prisma.role.upsert({
          where: { name: roleData.name },
          create: {
            name: roleData.name,
            displayName: roleData.displayName,
            displayNameArabic: roleData.displayNameArabic,
            description: roleData.description,
            descriptionArabic: roleData.descriptionArabic,
            isSystem: roleData.isSystem,
          },
          update: {
            displayName: roleData.displayName,
            displayNameArabic: roleData.displayNameArabic,
            description: roleData.description,
            descriptionArabic: roleData.descriptionArabic,
          },
        });

        // Assign permissions to role
        await prisma.rolePermission.deleteMany({
          where: { roleId: role.id },
        });

        for (const perm of roleData.permissions) {
          const permission = await prisma.permission.findUnique({
            where: {
              action_resource: {
                action: perm.action as PermissionAction,
                resource: perm.resource as PermissionResource,
              },
            },
          });

          if (permission) {
            await prisma.rolePermission.create({
              data: {
                roleId: role.id,
                permissionId: permission.id,
              },
            });
          }
        }
      }

      console.log('Default roles and permissions initialized successfully');
    } catch (error) {
      console.error('Failed to initialize default roles:', error);
      throw error;
    }
  }

  // Private helper methods

  private async assignPermissionsToRole(roleId: string, permissionIds: string[], assignedBy: string): Promise<void> {
    const permissions = await prisma.permission.findMany({
      where: {
        id: { in: permissionIds },
        isActive: true,
      },
    });

    if (permissions.length !== permissionIds.length) {
      throw new Error('Some permissions not found');
    }

    await prisma.rolePermission.createMany({
      data: permissionIds.map(permissionId => ({
        roleId,
        permissionId,
      })),
    });
  }
}