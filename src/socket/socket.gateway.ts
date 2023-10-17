import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisConnectionService } from 'src/redis-connection/redis-connection.service';
import { SocketService } from './socket.service';
import { JwtService } from '@nestjs/jwt';
import { PostgresqlService } from 'src/postgresql/postgresql.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'socket',
  transports: ['websocket', 'polling'],
})
export class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit  
{
  constructor(
    private readonly socketService: SocketService,
    private readonly redisService: RedisConnectionService,
    // private readonly pgService: PostgresqlService
  ) {}
  logger = new Logger('Socket-Gateway');
  @WebSocketServer() server: Server;


  async handleConnection(client: Socket) {
    try {
      this.logger.log(`${client.id} :::>> connected`);

      const token = client.handshake.headers.authorization;
      const jwt = new JwtService();
      const user: any = jwt.decode(token);
      console.log("🚀 ~ file: socket.gateway.ts:39 ~ handleConnection ~ user:", user)

      await this.redisService.addOnlineUser(user.userId);
      

      this.server.emit('test', 'socket connection testing')
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`${client.id} <<::: disconnected`);

    const token = client.handshake.headers.authorization;
    const jwt = new JwtService();
    const user: any = jwt.decode(token);

    this.redisService.removeUserOnline(user.userId);
  };

  afterInit(server: Server) {
    global._server = this.server;
    this.logger.log('Socket server initialized!')
  }

  @SubscribeMessage('join-room') 
  joinRoom(client: Socket, data: any) {
    client.join(data.roomId);
  }

  @SubscribeMessage('leave-room') 
  leaveRoom(client: Socket, data: any) {
    client.leave(data.roomId);    
  }

  @SubscribeMessage('chatting') 
  chatting(client: Socket, data: any) {
    const rooms = [...client.rooms];
    client.broadcast.to(rooms).emit('chatting', data)
    const { userId, username, message, time } = data;
    // this.pgService.query(` INSERT INTO public.conversation(id, user_id, username, message, time) 
    //   VALUES($1, $2, $3, $4, $5)`,
    //   [rooms[2], userId, username, message, time]
    // )
  }
  
}
