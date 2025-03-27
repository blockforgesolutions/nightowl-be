import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Eğer değer yoksa işleme gerek yok
    if (!value) {
      return value;
    }

    // MongoId kontrolü - class-validator'ün isMongoId metodunu kullanıyoruz
    if (!isMongoId(value)) {
      throw new BadRequestException(`${metadata.data} must be a valid MongoDB ObjectId`);
    }

    return value;
  }
} 