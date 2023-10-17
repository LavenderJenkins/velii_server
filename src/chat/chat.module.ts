import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { RedisConnectionService } from 'src/redis-connection/redis-connection.service';
import { PostgresqlService } from 'src/postgresql/postgresql.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService]
})
export class ChatModule {}
