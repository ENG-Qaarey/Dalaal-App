import { AdminManagementService } from './admin-management.service';
import { PrismaService } from '../database/prisma.service';

describe('AdminManagementService', () => {
  it('enriches audit logs with user and entity details', async () => {
    const prisma = {
      auditLog: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'log-1',
            userId: 'user-1',
            action: 'UPDATE',
            entityType: 'USER',
            entityId: 'user-1',
            oldValues: { status: 'PENDING' },
            newValues: { status: 'ACTIVE' },
            ipAddress: '127.0.0.1',
            createdAt: new Date('2024-01-02T00:00:00.000Z'),
          },
        ]),
        count: jest.fn().mockResolvedValue(1),
      },
      user: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'user-1',
            email: 'admin@example.com',
            profile: { firstName: 'Ada', lastName: 'Lovelace' },
          },
        ]),
      },
    };

    const service = new AdminManagementService(prisma as unknown as PrismaService);

    const result = await service.getAuditLogs({ page: 1, limit: 20 });

    expect(result.data[0]).toMatchObject({
      action: 'UPDATE',
      entity: 'USER',
      userEmail: 'admin@example.com',
      userName: 'Ada Lovelace',
      changes: 'status: PENDING -> ACTIVE',
    });
  });
});
