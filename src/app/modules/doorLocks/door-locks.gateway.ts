import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { DoorLockUserService } from '../doorLockUsers/door-locks-users.service';
import { DoorLocksService } from './door-locks.service';
import { Esp32Gateway } from 'src/ws.gateway';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class DoorLocksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(DoorLocksGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private doorLockUserService: DoorLockUserService,
    @Inject(forwardRef(() => DoorLocksService))
    private doorLocksService: DoorLocksService,
    private esp32Gateway: Esp32Gateway,
  ) { }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      if (!token) {
        this.logger.warn(`Conexão sem token - desconectando ${client.id}`);
        client.disconnect(true);
        return;
      }

      this.logger.log(`[WS] Tentando conectar: ${client.id}`);

      let payload: any;
      try {
        payload = this.jwtService.verify(token);
      } catch (err) {
        this.logger.error(`[WS] Erro ao verificar token: ${err.message}`);
        this.logger.error(`[WS] Token recebido: ${token.substring(0, 50)}...`);
        client.disconnect(true);
        return;
      }

      const userId = payload?.sub || payload?.id;
      if (!userId) {
        this.logger.warn(`Token inválido - desconectando ${client.id}`);
        this.logger.warn(`Payload do token: ${JSON.stringify(payload)}`);
        client.disconnect(true);
        return;
      }

      client.data.userId = userId;
      client.join(`user:${userId}`);
      this.logger.log(`[WS] Cliente conectado: ${client.id} (user:${userId})`);

      // handlers simples expostos via socket
      client.on('join-lock', async ({ lockId }) => {
        try {
          const access = await this.doorLockUserService.findByUserAndLock(userId, lockId);
          if (!access) {
            client.emit('error', { message: 'Acesso negado a essa fechadura' });
            return;
          }
          client.join(`lock:${lockId}`);
          client.emit('joined-lock', { lockId });
          this.logger.log(`[WS] User ${userId} joined lock:${lockId}`);
        } catch (err) {
          this.logger.error('Erro join-lock', err);
        }
      });

      client.on('leave-lock', ({ lockId }) => {
        client.leave(`lock:${lockId}`);
        this.logger.log(`[WS] User ${userId} left lock:${lockId}`);
      });
    } catch (err) {
      this.logger.error(`[WS] Falha ao validar token socket: ${err.message}`);
      this.logger.error(`[WS] Stack: ${err.stack}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    this.logger.log(`[WS] Cliente desconectado: ${client.id} (user:${userId})`);
  }

  @SubscribeMessage('toggle-lock')
  async handleToggleLock(client: Socket, payload: { lockId: number; status: string }) {
    try {
      const userId = client.data?.userId;
      if (!userId) {
        client.emit('error', { message: 'Não autenticado' });
        return;
      }

      const { lockId, status } = payload;
      this.logger.log(`[WS] toggle-lock: user:${userId} lock:${lockId} status:${status}`);

      // Verifica se o usuário tem acesso à fechadura
      const access = await this.doorLockUserService.findByUserAndLock(userId, lockId);
      if (!access) {
        client.emit('error', { message: 'Acesso negado a essa fechadura' });
        return;
      }

      // Atualiza o status da fechadura
      await this.doorLocksService.update(String(lockId), { status });

      // Envia comando para o ESP32
      if (status === 'on') {
        this.logger.log(`[WS] Enviando comando de abertura para ESP32 (lock:${lockId})`);
        this.esp32Gateway.sendOpenCommand(lockId);
      } else if (status === 'off') {
        this.logger.log(`[WS] Enviando comando de fechamento para ESP32 (lock:${lockId})`);
        this.esp32Gateway.sendCloseCommand(lockId);
      }

      // O método update já emite o evento door-lock-updated via emitDoorLockUpdated
      this.logger.log(`[WS] Status atualizado: lock:${lockId} -> ${status}`);
    } catch (err) {
      this.logger.error('Erro toggle-lock', err);
      client.emit('error', { message: 'Erro ao atualizar status' });
    }
  }

  emitDoorLockUpdated(lock: any) {
    this.logger.log(`Emitindo door-lock-updated para lock:${lock.id}`);
    this.server.to(`lock:${lock.id}`).emit('door-lock-updated', {
      id: lock.id,
      name: lock.name,
      localization: lock.localization,
      status: lock.status,
    });
  }

  emitDoorLockRemoved(lockId: number) {
    this.server.to(`lock:${lockId}`).emit('door-lock-removed', { id: lockId });
  }
}
