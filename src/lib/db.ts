import './env-setup'; // MUST be first - sets DATABASE_URL before Prisma loads
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with production-ready configuration
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'minimal',
  })

// Configure connection pool for production
if (process.env.NODE_ENV === 'production') {
  const poolMin = parseInt(process.env.DB_POOL_MIN || '2')
  const poolMax = parseInt(process.env.DB_POOL_MAX || '10')
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Initialize database with demo data if needed
export async function initializeDatabase() {
  try {
    await db.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')

    const demoTenant = await db.tenant.findFirst({
      where: { subdomain: 'demo' }
    })

    if (!demoTenant && process.env.NODE_ENV === 'development') {
      console.log('📝 Creating demo tenant and users...')
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  }
}

// Tenant-aware database context
export class TenantDB {
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  async user(args: any = {}) {
    return db.user.findMany({
      ...args,
      where: {
        ...args.where,
        tenantId: this.tenantId
      }
    });
  }

  async findUniqueUser(args: any) {
    return db.user.findUnique({
      ...args,
      where: {
        ...args.where,
        tenantId: this.tenantId
      }
    });
  }

  async createUser(args: any) {
    return db.user.create({
      ...args,
      data: {
        ...args.data,
        tenantId: this.tenantId
      }
    });
  }

  async updateUser(args: any) {
    return db.user.update({
      ...args,
      where: {
        ...args.where,
        tenantId: this.tenantId
      }
    });
  }

  async deleteUser(args: any) {
    return db.user.delete({
      ...args,
      where: {
        ...args.where,
        tenantId: this.tenantId
      }
    });
  }

  async guard(args: any = {}) {
    const whereClause = {
      ...args.where,
      user: {
        tenantId: this.tenantId
      }
    };
    return db.guard.findMany({
      ...args,
      where: whereClause
    });
  }

  async findUniqueGuard(args: any) {
    return db.guard.findUnique({
      ...args,
      where: {
        ...args.where,
        user: {
          tenantId: this.tenantId
        }
      }
    });
  }

  async createGuard(args: any) {
    const { TenantService } = await import('@/lib/tenant');
    const limits = await TenantService.checkTenantLimits(this.tenantId);
    if (!limits.canAddGuards) {
      throw new Error(`Guard limit reached. Current: ${limits.currentGuards}, Limit: ${limits.guardLimit}`);
    }
    return db.guard.create({
      ...args,
      data: {
        ...args.data,
        user: {
          connect: {
            id: args.data.userId,
            tenantId: this.tenantId
          }
        }
      }
    });
  }

  async guardCount(args: any = {}) {
    const whereClause = {
      ...args.where,
      user: {
        tenantId: this.tenantId
      }
    };
    return db.guard.count({
      ...args,
      where: whereClause
    });
  }

  async userCount(args: any = {}) {
    return db.user.count({
      ...args,
      where: {
        ...args.where,
        tenantId: this.tenantId
      }
    });
  }

  async incidentCount(args: any = {}) {
    return db.incident.count({
      ...args,
      where: {
        ...args.where,
        tenantId: this.tenantId
      }
    });
  }

  async safetyCheckCount(args: any = {}) {
    return db.safetyCheck.count({
      ...args,
      where: {
        ...args.where,
        tenantId: this.tenantId
      }
    });
  }

  async healthRecord(args: any = {}) {
    return db.healthRecord.findMany({
      ...args,
      where: {
        ...args.where,
        tenantId: this.tenantId
      }
    });
  }

  async healthRecordCount(args: any = {}) {
    return db.healthRecord.count({
      ...args,
      where: {
        ...args.where,
        tenantId: this.tenantId
      }
    });
  }

  async createHealthRecord(args: any) {
    return db.healthRecord.create({
      ...args,
      data: {
        ...args.data,
        tenantId: this.tenantId
      }
    });
  }

  async post(args: any = {}) {
    return db.post.findMany({
      ...args,
      where: {
        ...args.where,
        user: {
          tenantId: this.tenantId
        }
      }
    });
  }

  async findUniquePost(args: any) {
    return db.post.findUnique({
      ...args,
      where: {
        ...args.where,
        user: {
          tenantId: this.tenantId
        }
      }
    });
  }

  async createPost(args: any) {
    const { TenantService } = await import('@/lib/tenant');
    const limits = await TenantService.checkTenantLimits(this.tenantId);
    if (!limits.canAddPosts) {
      throw new Error(`Post limit reached. Current: ${limits.currentPosts}, Limit: ${limits.postLimit}`);
    }
    return db.post.create({
      ...args,
      data: {
        ...args.data,
        user: {
          connect: {
            id: args.data.userId,
            tenantId: this.tenantId
          }
        }
      }
    });
  }

  async shift(args: any = {}) {
    return db.shift.findMany({
      ...args,
      where: {
        ...args.where,
        user: {
          tenantId: this.tenantId
        }
      }
    });
  }

  async findUniqueShift(args: any) {
    return db.shift.findUnique({
      ...args,
      where: {
        ...args.where,
        user: {
          tenantId: this.tenantId
        }
      }
    });
  }

  async attendance(args: any = {}) {
    return db.attendance.findMany({
      ...args,
      where: {
        ...args.where,
        user: {
          tenantId: this.tenantId
        }
      }
    });
  }

  async leave(args: any = {}) {
    return db.leave.findMany({
      ...args,
      where: {
        ...args.where,
        user: {
          tenantId: this.tenantId
        }
      }
    });
  }

  async salary(args: any = {}) {
    return db.salary.findMany({
      ...args,
      where: {
        ...args.where,
        user: {
          tenantId: this.tenantId
        }
      }
    });
  }

  async document(args: any = {}) {
    return db.document.findMany({
      ...args,
      where: {
        ...args.where,
        user: {
          tenantId: this.tenantId
        }
      }
    });
  }

  async location(args: any = {}) {
    return db.location.findMany({
      ...args,
      where: {
        ...args.where,
        user: {
          tenantId: this.tenantId
        }
      }
    });
  }

  async alert(args: any = {}) {
    return db.alert.findMany({
      ...args,
      where: {
        ...args.where,
        user: {
          tenantId: this.tenantId
        }
      }
    });
  }

  async notification(args: any = {}) {
    return db.notification.findMany({
      ...args,
      where: {
        ...args.where,
        OR: [
          {
            user: {
              tenantId: this.tenantId
            }
          },
          {
            guard: {
              user: {
                tenantId: this.tenantId
              }
            }
          }
        ]
      }
    });
  }

  async incident(args: any = {}) {
    return db.incident.findMany({
      ...args,
      where: {
        ...args.where,
        user: {
          tenantId: this.tenantId
        }
      }
    });
  }

  async findUniqueIncident(args: any) {
    return db.incident.findUnique({
      ...args,
      where: {
        ...args.where,
        user: {
          tenantId: this.tenantId
        }
      }
    });
  }

  async createIncident(args: any) {
    return db.incident.create({
      ...args,
      data: {
        ...args.data,
        user: {
          connect: {
            id: args.data.userId,
            tenantId: this.tenantId
          }
        }
      }
    });
  }

  async updateIncident(args: any) {
    return db.incident.update({
      ...args,
      where: {
        ...args.where,
        user: {
          tenantId: this.tenantId
        }
      }
    });
  }

  async deleteIncident(args: any) {
    return db.incident.delete({
      ...args,
      where: {
        ...args.where,
        user: {
          tenantId: this.tenantId
        }
      }
    });
  }

  async message(args: any = {}) {
    return db.message.findMany({
      ...args,
      where: {
        ...args.where,
        OR: [
          {
            sender: {
              tenantId: this.tenantId
            }
          },
          {
            receiver: {
              tenantId: this.tenantId
            }
          }
        ]
      }
    });
  }

  async findUniqueMessage(args: any) {
    return db.message.findUnique({
      ...args,
      where: {
        ...args.where,
        OR: [
          {
            sender: {
              tenantId: this.tenantId
            }
          },
          {
            receiver: {
              tenantId: this.tenantId
            }
          }
        ]
      }
    });
  }

  async createMessage(args: any) {
    return db.message.create({
      ...args,
      data: {
        ...args.data,
        sender: {
          connect: {
            id: args.data.senderId,
            tenantId: this.tenantId
          }
        },
        receiver: {
          connect: {
            id: args.data.receiverId,
            tenantId: this.tenantId
          }
        }
      }
    });
  }

  async updateMessage(args: any) {
    return db.message.update({
      ...args,
      where: {
        ...args.where,
        OR: [
          {
            sender: {
              tenantId: this.tenantId
            }
          },
          {
            receiver: {
              tenantId: this.tenantId
            }
          }
        ]
      }
    });
  }

  async deleteMessage(args: any) {
    return db.message.delete({
      ...args,
      where: {
        ...args.where,
        OR: [
          {
            sender: {
              tenantId: this.tenantId
            }
          },
          {
            receiver: {
              tenantId: this.tenantId
            }
          }
        ]
      }
    });
  }

  async permission(args: any = {}) {
    return db.permission.findMany({
      ...args,
      where: {
        ...args.where,
        userPermissions: {
          some: {
            user: {
              tenantId: this.tenantId
            }
          }
        }
      }
    });
  }

  async findUniquePermission(args: any) {
    return db.permission.findUnique({
      ...args,
      where: {
        ...args.where,
        userPermissions: {
          some: {
            user: {
              tenantId: this.tenantId
            }
          }
        }
      }
    });
  }

  async createPermission(args: any) {
    return db.permission.create({
      ...args,
      data: {
        ...args.data,
        userPermissions: {
          create: args.data.userPermissions?.map((up: any) => ({
            user: {
              connect: {
                id: up.userId,
                tenantId: this.tenantId
              }
            }
          }))
        }
      }
    });
  }

  async updatePermission(args: any) {
    return db.permission.update({
      ...args,
      where: {
        ...args.where,
        userPermissions: {
          some: {
            user: {
              tenantId: this.tenantId
            }
          }
        }
      }
    });
  }

  async deletePermission(args: any) {
    return db.permission.delete({
      ...args,
      where: {
        ...args.where,
        userPermissions: {
          some: {
            user: {
              tenantId: this.tenantId
            }
          }
        }
      }
    });
  }

  async role(args: any = {}) {
    return db.role.findMany({
      ...args,
      where: {
        ...args.where,
        tenantId: this.tenantId
      }
    });
  }

  async findUniqueRole(args: any) {
    return db.role.findUnique({
      ...args,
      where: {
        ...args.where,
        tenantId: this.tenantId
      }
    });
  }

  async findFirstRole(args: any) {
    return db.role.findFirst({
      ...args,
      where: {
        ...args.where,
        tenantId: this.tenantId
      }
    });
  }

  async createRole(args: any) {
    return db.role.create({
      ...args,
      data: {
        ...args.data,
        tenantId: this.tenantId
      }
    });
  }

  async updateRole(args: any) {
    return db.role.update({
      ...args,
      where: {
        ...args.where,
        tenantId: this.tenantId
      }
    });
  }

  async deleteRole(args: any) {
    return db.role.delete({
      ...args,
      where: {
        ...args.where,
        tenantId: this.tenantId
      }
    });
  }

  async rolePermission(args: any = {}) {
    return db.rolePermission.findMany({
      ...args,
      where: {
        ...args.where,
        role: {
          tenantId: this.tenantId
        }
      }
    });
  }

  async createManyRolePermission(args: any) {
    return db.rolePermission.createMany({
      ...args,
      data: args.data.map((data: any) => ({
        ...data,
        role: {
          connect: {
            id: data.roleId,
            tenantId: this.tenantId
          }
        }
      }))
    });
  }

  async safetyCheck(args: any = {}) {
    return db.safetyCheck.findMany({
      ...args,
      where: {
        ...args.where,
        guard: {
          user: {
            tenantId: this.tenantId
          }
        }
      }
    });
  }

  async findUniqueSafetyCheck(args: any) {
    return db.safetyCheck.findUnique({
      ...args,
      where: {
        ...args.where,
        guard: {
          user: {
            tenantId: this.tenantId
          }
        }
      }
    });
  }

  async createSafetyCheck(args: any) {
    return db.safetyCheck.create({
      ...args,
      data: {
        ...args.data,
        guard: {
          connect: {
            id: args.data.guardId,
            user: {
              tenantId: this.tenantId
            }
          }
        }
      }
    });
  }

  async updateSafetyCheck(args: any) {
    return db.safetyCheck.update({
      ...args,
      where: {
        ...args.where,
        guard: {
          user: {
            tenantId: this.tenantId
          }
        }
      }
    });
  }

  async deleteSafetyCheck(args: any) {
    return db.safetyCheck.delete({
      ...args,
      where: {
        ...args.where,
        guard: {
          user: {
            tenantId: this.tenantId
          }
        }
      }
    });
  }

  async wellnessCheck(args: any = {}) {
    return db.wellnessCheck.findMany({
      ...args,
      where: {
        ...args.where,
        guard: {
          user: {
            tenantId: this.tenantId
          }
        }
      }
    });
  }

  async findUniqueWellnessCheck(args: any) {
    return db.wellnessCheck.findUnique({
      ...args,
      where: {
        ...args.where,
        guard: {
          user: {
            tenantId: this.tenantId
          }
        }
      }
    });
  }

  async createWellnessCheck(args: any) {
    return db.wellnessCheck.create({
      ...args,
      data: {
        ...args.data,
        guard: {
          connect: {
            id: args.data.guardId,
            user: {
              tenantId: this.tenantId
            }
          }
        }
      }
    });
  }

  async updateWellnessCheck(args: any) {
    return db.wellnessCheck.update({
      ...args,
      where: {
        ...args.where,
        guard: {
          user: {
            tenantId: this.tenantId
          }
        }
      }
    });
  }

  async deleteWellnessCheck(args: any) {
    return db.wellnessCheck.delete({
      ...args,
      where: {
        ...args.where,
        guard: {
          user: {
            tenantId: this.tenantId
          }
        }
      }
    });
  }

  async getTenant() {
    return db.tenant.findUnique({
      where: { id: this.tenantId },
      include: {
        settings: true,
        subscriptions: {
          where: { status: 'active' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
  }

  async announcement(args: any = {}) {
    return db.announcement.findMany({
      ...args,
      where: {
        ...args.where,
        tenantId: this.tenantId
      }
    });
  }

  async createAnnouncement(args: any) {
    return db.announcement.create({
      ...args,
      data: {
        ...args.data,
        tenantId: this.tenantId
      }
    });
  }

  async getSettings() {
    const settings = await db.tenantSetting.findMany({
      where: { tenantId: this.tenantId }
    });
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
  }

  async incidentReport(args: any = {}) {
    return db.incidentReport.findMany({
      ...args,
      where: {
        ...args.where,
        incident: {
          user: {
            tenantId: this.tenantId
          }
        }
      }
    });
  }

  async createIncidentReport(args: any) {
    return db.incidentReport.create({
      ...args,
      data: {
        ...args.data,
        incident: {
          connect: {
            id: args.data.incidentId,
            user: {
              tenantId: this.tenantId
            }
          }
        }
      }
    });
  }

  async updateIncidentReport(args: any) {
    return db.incidentReport.update({
      ...args,
      where: {
        ...args.where,
        incident: {
          user: {
            tenantId: this.tenantId
          }
        }
      }
    });
  }

  async deleteIncidentReport(args: any) {
    return db.incidentReport.delete({
      ...args,
      where: {
        ...args.where,
        incident: {
          user: {
            tenantId: this.tenantId
          }
        }
      }
    });
  }
}

// Helper function to create tenant context
export function createTenantContext(tenantId: string): TenantDB {
  return new TenantDB(tenantId);
}

// Helper function to get tenant ID from request
export function getTenantIdFromRequest(request: Request): string | null {
  return request.headers.get('x-tenant-id');
}
