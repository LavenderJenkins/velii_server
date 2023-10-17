import { Injectable } from '@nestjs/common';
import { PostgresqlService } from 'src/postgresql/postgresql.service';
import { RedisConnectionService } from 'src/redis-connection/redis-connection.service';
import * as moment from 'moment';

@Injectable()
export class ChatService {
  constructor(
    // private readonly postgres: PostgresqlService,
    private readonly redisService: RedisConnectionService,
  ) {}

  async getConversations(userId: string) {
    // const userList = (
    //   await this.postgres.query(
    //     `
    //   SELECT * FROM public.user
    //   WHERE id != $1`,
    //     [userId],
    //   )
    // ).rows;

    // const lastMessage = (
    //   await this.postgres.query(`
    //   SELECT id, user_id, message, time, username
    //   FROM public.conversation
    //   WHERE (id, time) IN (
    //       SELECT id, MAX(time) AS max_time
    //       FROM public.conversation
    //       GROUP BY id
    //   );
      
    // `)
    // ).rows as any;

    // const userOnline = await this.redisService.getAllUserOnline();

    // const chatList = userList
    //   .map((user: any) => {
    //     delete user.password;
    //     delete user.avatar;
    //     return {
    //       ...user,
    //       latestMessage: lastMessage.find((msg: any) => (msg.id = user.id))
    //         .message,
    //       time: moment(
    //         lastMessage.find((msg: any) => (msg.id = user.id)).time,
    //       ).format('YYYY-MM-DD HH:mm:ss'),
    //       isOnline: userOnline.includes(user.id) ? true : false,
    //     };
    //   })
    //   .sort((user) => (user.isOnline ? -1 : 1));

    // console.log(
    //   '🚀 ~ file: chat.service.ts:61 ~ ChatService ~ getConversations ~ chatList:',
    //   chatList,
    // );
    // return chatList;
  }

  async getConversationMessages(userId: string, conversationId: string) {
    // const messages = await this.postgres.query(
    //   ` SELECT 
    //       user_id as userId,
    //       username,
    //       message,
    //       time
    //     FROM public.conversation
    //     WHERE (user_id = $1 AND id = $2) 
    //     OR (user_id = $2 AND id = $1) 
    //     ORDER BY time`,
    //   [userId, conversationId],
    // );
    // return messages.rows;
  }
}
