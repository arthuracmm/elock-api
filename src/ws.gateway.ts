import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { WebSocket, WebSocketServer } from 'ws';

@Injectable()
export class Esp32Gateway implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(Esp32Gateway.name);
    private wss: WebSocketServer;
    private esp32Clients: Set<WebSocket> = new Set();

    onModuleInit() {
        // Cria servidor WebSocket independente na porta 8001
        this.wss = new WebSocketServer({ port: 8001, path: '/esp32' });

        this.logger.log('Servidor WebSocket ESP32 iniciado na porta 8001 (path: /esp32)');

        this.wss.on('connection', (client: WebSocket) => {
            this.handleConnection(client);
        });
    }

    onModuleDestroy() {
        if (this.wss) {
            this.wss.close();
        }
    }

    handleConnection(client: WebSocket) {
        this.logger.log('[ESP32] Cliente conectado na porta 8001');
        this.esp32Clients.add(client);

        // Envia mensagem de boas-vindas
        client.send(JSON.stringify({
            type: 'welcome',
            message: 'Conectado ao servidor ELOCK (Porta 8001)'
        }));

        // Escuta mensagens do ESP32
        client.on('message', (data: Buffer) => {
            try {
                const message = data.toString();
                this.logger.log(`[ESP32] Mensagem recebida: ${message}`);
            } catch (err) {
                this.logger.error(`[ESP32] Erro ao processar mensagem: ${err.message}`);
            }
        });

        client.on('error', (err) => {
            this.logger.error(`[ESP32] Erro no cliente: ${err.message}`);
        });

        client.on('close', () => {
            this.handleDisconnect(client);
        });
    }

    handleDisconnect(client: WebSocket) {
        this.logger.log('[ESP32] Cliente desconectado');
        this.esp32Clients.delete(client);
    }

    // Método para enviar comandos para todos os ESP32 conectados
    sendToAllESP32(message: any) {
        const payload = typeof message === 'string' ? message : JSON.stringify(message);
        this.esp32Clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        });
        this.logger.log(`[ESP32] Mensagem enviada para ${this.esp32Clients.size} cliente(s)`);
    }

    // Método para enviar comando para abrir fechadura específica
    sendOpenCommand(lockId: number) {
        this.sendToAllESP32({
            type: 'command',
            action: 'OPEN',
            lockId: lockId,
            timestamp: new Date().toISOString()
        });
    }

    // Método para enviar comando para fechar fechadura específica
    sendCloseCommand(lockId: number) {
        this.sendToAllESP32({
            type: 'command',
            action: 'CLOSE',
            lockId: lockId,
            timestamp: new Date().toISOString()
        });
    }
}
