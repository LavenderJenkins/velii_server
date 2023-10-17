import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CatchException } from 'src/exceptions/common.exception';
import { GetUserIdFromToken } from 'src/utils/utils.decorators';
import { BaseResponse, ListResponse } from 'src/utils/utils.response';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create.dto';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get()
  async getList(
    @GetUserIdFromToken() userId: string,
    @Query() query: any,
    @Res() res: Response,
  ) {
    try {
      const { data, skip, total } = await this.documentService.getList(
        userId,
        query,
      );
      return res
        .status(HttpStatus.OK)
        .send(new ListResponse({ data, skip, total }));
    } catch (e) {
      throw new CatchException(e);
    }
  }

  @Get('/schools')
  async getListSchool(
    @GetUserIdFromToken() userId: string,
    @Query() query: any,
    @Res() res: Response,
  ) {
    try {
      const data = await this.documentService.getListSchool(userId, query);
      return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
    } catch (e) {
      throw new CatchException(e);
    }
  }

  @Get('/subjects')
  async getListSubject(
    @GetUserIdFromToken() userId: string,
    @Query() query: any,
    @Res() res: Response,
  ) {
    try {
      const data = await this.documentService.getListSubject(userId, query);
      return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
    } catch (e) {
      throw new CatchException(e);
    }
  }

  @Post()
  async create(
    @GetUserIdFromToken() userId: string,
    @Body() body: CreateDocumentDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.documentService.create(userId, body);
      return res
        .status(HttpStatus.CREATED)
        .send(
          new BaseResponse({ data, message: 'Đăng tài liệu mới thành công' }),
        );
    } catch (e) {
      throw new CatchException(e);
    }
  }

  @Put('/:documentId')
  async update(
    @GetUserIdFromToken() userId: string,
    @Param('documentId') documentId: string,
    @Body() body: CreateDocumentDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.documentService.update(documentId, userId, body);
      return res
        .status(HttpStatus.CREATED)
        .send(
          new BaseResponse({ data, message: 'Cập nhật tài liệu thành công' }),
        );
    } catch (e) {
      throw new CatchException(e);
    }
  }
}
