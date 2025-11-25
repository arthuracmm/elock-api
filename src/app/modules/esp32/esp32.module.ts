import { Module, Global } from '@nestjs/common';
import { Esp32Gateway } from '../../../ws.gateway';

@Global()
@Module({
    providers: [Esp32Gateway],
    exports: [Esp32Gateway],
})
export class Esp32Module { }
