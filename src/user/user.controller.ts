import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { CatchException } from 'src/exceptions/common.exception';
import { BaseResponse } from 'src/utils/utils.response';
import { UserService } from './user.service';
import { GetUserIdFromToken } from 'src/utils/utils.decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  async findOne(
    @GetUserIdFromToken() user: string,
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    try {
      const data = await this.userService.findOne(userId);
      return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
    } catch (e) {
      throw new CatchException(e);
    }
  }
}
