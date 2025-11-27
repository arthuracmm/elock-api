import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DoorLockLog } from './door-lock-logs.model';
import { DoorLocks } from '../doorLocks/door-locks.model';
import { User } from '../users/user.model';
import { Op } from 'sequelize';

@Injectable()
export class DoorLockLogsService {
    constructor(
        @InjectModel(DoorLockLog)
        private doorLockLogModel: typeof DoorLockLog,
    ) { }

    async createLog(doorLockId: number, userId: number, action: 'OPEN' | 'CLOSE') {
        return this.doorLockLogModel.create({
            doorLockId,
            userId,
            action,
        } as any);
    }

    async getRecentLogs(limit: number = 10, userId?: number) {
        const whereClause: any = {};

        if (userId) {
            // Buscar logs apenas das fechaduras que o usuário tem acesso
            whereClause['$doorLock.users.id$'] = userId;
        }

        return this.doorLockLogModel.findAll({
            where: whereClause,
            include: [
                {
                    model: DoorLocks,
                    as: 'doorLock',
                    attributes: ['id', 'name'],
                    ...(userId ? {
                        include: [{
                            model: User,
                            attributes: [],
                            where: { id: userId },
                            through: { attributes: [] },
                            required: true,
                        }]
                    } : {})
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit,
        });
    }

    async getUsageTimeline(days: number = 7, userId?: number) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const whereClause: any = {
            createdAt: {
                [Op.gte]: startDate,
            },
        };

        if (userId) {
            whereClause['$doorLock.users.id$'] = userId;
        }

        const logs = await this.doorLockLogModel.findAll({
            where: whereClause,
            include: userId ? [{
                model: DoorLocks,
                as: 'doorLock',
                attributes: [],
                include: [{
                    model: User,
                    attributes: [],
                    where: { id: userId },
                    through: { attributes: [] },
                    required: true,
                }]
            }] : [],
            attributes: ['action', 'createdAt'],
            raw: true,
        });

        // Agrupar por data
        const timeline: { [key: string]: { opens: number; closes: number } } = {};

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            timeline[dateStr] = { opens: 0, closes: 0 };
        }

        logs.forEach((log: any) => {
            const dateStr = new Date(log.createdAt).toISOString().split('T')[0];
            if (timeline[dateStr]) {
                if (log.action === 'OPEN') {
                    timeline[dateStr].opens++;
                } else if (log.action === 'CLOSE') {
                    timeline[dateStr].closes++;
                }
            }
        });

        return Object.entries(timeline)
            .map(([date, counts]) => ({ date, ...counts }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }

    async getMostUsedLocks(limit: number = 5, userId?: number) {
        const whereClause: any = {};

        if (userId) {
            whereClause['$doorLock.users.id$'] = userId;
        }

        const logs = await this.doorLockLogModel.findAll({
            where: whereClause,
            include: [{
                model: DoorLocks,
                as: 'doorLock',
                attributes: ['id', 'name'],
                ...(userId ? {
                    include: [{
                        model: User,
                        attributes: [],
                        where: { id: userId },
                        through: { attributes: [] },
                        required: true,
                    }]
                } : {})
            }],
            attributes: ['doorLockId'],
            raw: true,
        });

        // Contar usos por fechadura
        const usageCount: { [key: number]: { id: number; name: string; count: number } } = {};

        logs.forEach((log: any) => {
            const lockId = log.doorLockId;
            if (!usageCount[lockId]) {
                usageCount[lockId] = {
                    id: lockId,
                    name: log['doorLock.name'],
                    count: 0,
                };
            }
            usageCount[lockId].count++;
        });

        return Object.values(usageCount)
            .sort((a, b) => b.count - a.count)
            .slice(0, limit)
            .map(item => ({
                id: item.id,
                name: item.name,
                usageCount: item.count,
            }));
    }
}
