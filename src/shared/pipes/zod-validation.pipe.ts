/* eslint-disable @typescript-eslint/no-unsafe-return */
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodError, z } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodType<any>) {}

  transform(value: unknown) {
    try {
      const result = this.schema.parse(value);
      return result;
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));

        throw new BadRequestException({
          message: 'Validation failed',
          errors: validationErrors,
        });
      }

      throw new BadRequestException('Validation failed');
    }
  }
}
