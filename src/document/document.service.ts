import { HttpStatus, Injectable } from '@nestjs/common';
import { PostgresqlService } from 'src/postgresql/postgresql.service';
import { RedisConnectionService } from 'src/redis-connection/redis-connection.service';
import * as moment from 'moment';
import { CreateDocumentDto } from './dto/create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Document } from 'src/models/document.model';
import { Model } from 'mongoose';
import { School } from 'src/models/school.model';
import { Subject } from 'src/models/subject.model';
import { ExceptionResponse } from 'src/exceptions/common.exception';

@Injectable()
export class DocumentService {
  constructor(
    // private readonly postgres: PostgresqlService,
    private readonly redisService: RedisConnectionService,
    @InjectModel(Document.name)
    private readonly documentModel: Model<Document>,
    @InjectModel(School.name)
    private readonly schoolModel: Model<School>,
    @InjectModel(Subject.name)
    private readonly subjectModel: Model<Subject>,
  ) {}

  async create(userId: string, body: CreateDocumentDto) {
    const [school, subject] = await Promise.all([
      this.schoolModel.findById(body.school_id).lean(),
      this.subjectModel.findById(body.subject_id).lean(),
    ]);

    if (!school) {
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Trường học không hợp lệ',
      );
    }

    if (!subject) {
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Môn học không hợp lệ',
      );
    }

    const document = (
      await this.documentModel.create({
        ...body,
        created_by: userId,
      })
    ).toObject();

    return document;
  }

  async update(documentId: string, userId: string, body: CreateDocumentDto) {
    const { is_free, price } = body;

    const [school, subject, document] = await Promise.all([
      this.schoolModel.findById(body.school_id).lean(),
      this.subjectModel.findById(body.subject_id).lean(),
      this.documentModel.findById(documentId).lean(),
    ]);

    if (!document) {
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Tài liệu không hợp lệ',
      );
    }

    if (!school) {
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Trường học không hợp lệ',
      );
    }

    if (!subject) {
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Môn học không hợp lệ',
      );
    }

    const newDocument = await this.documentModel.findByIdAndUpdate(
      documentId,
      {
        ...body,
        price: is_free ? 0 : price,
        created_by: userId,
      },
      { new: true },
    );

    return newDocument;
  }

  async getList(userId: string, query) {
    const { search = '', price_from = null, price_to = null } = query;
    const skip = !isNaN(+query?.skip) ? +query?.skip : 0;
    const limit = !isNaN(+query?.limit) ? +query?.limit : 0;

    const conditions = {
      $and: [
        {
          $or: [
            {
              ...(search && { name: { $regex: search, $options: 'i' } }),
            },
            {
              ...(search && {
                description: { $regex: search, $options: 'i' },
              }),
            },
            {
              ...(search && { address: { $regex: search, $options: 'i' } }),
            },
          ],
        },
        {
          ...(price_from &&
            price_to && { price: { $gte: +price_from, $lte: +price_to } }),
        },
      ],
    };
    const [data, total] = await Promise.all([
      this.documentModel
        .find(conditions)
        .populate(['school_id', 'subject_id'])
        .skip(skip)
        .limit(limit)
        .lean(),
      this.documentModel.countDocuments(conditions),
    ]);

    const result = data.map((doc) => {
      const school = doc.school_id;
      const subject = doc.subject_id;

      delete doc.school_id;
      delete doc.subject_id;

      return {
        ...doc,
        school,
        subject,
      };
    });

    return { data: result, total, skip: skip };
  }

  async getListSchool(userId: string, query) {
    const { search = '' } = query;

    const data = await this.schoolModel
      .find({
        ...(search && { name: { $regex: search, $options: 'i' } }),
      })
      .skip(+query.skip)
      .limit(+query.limit)
      .lean();
    return data;
  }

  async getListSubject(userId: string, query) {
    const { search = '' } = query;

    const data = await this.subjectModel
      .find({
        ...(search && { name: { $regex: search, $options: 'i' } }),
      })
      .skip(+query.skip)
      .limit(+query.limit)
      .lean();
    return data;
  }
}
