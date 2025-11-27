import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DoorLocksService } from './door-locks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('statistics')
@ApiBearerAuth('access-token')
@Controller('door-locks/statistics')
export class StatisticsController {
    constructor(private readonly doorLocksService: DoorLocksService) { }

    @Get('overview')
    @ApiOperation({ summary: 'Obter estatísticas gerais (KPIs)' })
    @UseGuards(JwtAuthGuard)
    async getOverview(@Req() req: any) {
        const userId = req.user?.id;
        return this.doorLocksService.getOverviewStats(userId);
    }

    @Get('usage-timeline')
    @ApiOperation({ summary: 'Obter timeline de uso das fechaduras' })
    @UseGuards(JwtAuthGuard)
    async getUsageTimeline(@Req() req: any) {
        const userId = req.user?.id;
        return this.doorLocksService.getUsageTimeline(userId);
    }

    @Get('most-used')
    @ApiOperation({ summary: 'Obter fechaduras mais utilizadas' })
    @UseGuards(JwtAuthGuard)
    async getMostUsed(@Req() req: any) {
        const userId = req.user?.id;
        return this.doorLocksService.getMostUsedLocks(userId);
    }

    @Get('status-distribution')
    @ApiOperation({ summary: 'Obter distribuição de status das fechaduras' })
    @UseGuards(JwtAuthGuard)
    async getStatusDistribution(@Req() req: any) {
        const userId = req.user?.id;
        return this.doorLocksService.getStatusDistribution(userId);
    }

    @Get('recent-activity')
    @ApiOperation({ summary: 'Obter atividades recentes' })
    @UseGuards(JwtAuthGuard)
    async getRecentActivity(@Req() req: any) {
        const userId = req.user?.id;
        return this.doorLocksService.getRecentActivity(userId);
    }
}
