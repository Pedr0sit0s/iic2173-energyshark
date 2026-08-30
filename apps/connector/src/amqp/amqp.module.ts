import { Module } from '@nestjs/common';
import { ForwardModule } from '../forward/forward.module';
import { AmqpService } from './amqp.service';

@Module({
  imports: [ForwardModule],
  providers: [AmqpService],
  exports: [AmqpService],
})
export class AmqpModule {}
