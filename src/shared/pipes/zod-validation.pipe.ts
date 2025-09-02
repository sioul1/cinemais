// src/common/pipes/zod-validation.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod'; // Correctly import the ZodSchema type

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {} // Use ZodSchema as the type

  transform(value: unknown) {
    try {
      // The parse method will throw an error if validation fails
      this.schema.parse(value);
      return value;
    } catch (error) {
      throw new BadRequestException('Validation failed', error);
    }
  }
}
