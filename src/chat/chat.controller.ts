import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Response } from 'express';
import { BaseResponse } from 'src/utils/utils.response';
import { CatchException } from 'src/exceptions/common.exception';
import { GetUserIdFromToken } from 'src/utils/utils.decorators';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('list')
  async getConversations(@GetUserIdFromToken() userId: string, @Res() res: Response) {
    try {
      const data = await this.chatService.getConversations(userId);
      return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
    } catch (e) {
      throw new CatchException(e);
    }
  }

  @Get('/:conversationId')
  async getConversationMessages(@GetUserIdFromToken() userId: string, @Param('conversationId') conversationId: string, @Res() res: Response) {
    try {
      const data = await this.chatService.getConversationMessages(userId, conversationId);
      return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
    } catch (e) {
      throw new CatchException(e);
    }
  }
}
