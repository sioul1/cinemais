/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;

    console.log(`[REQ] ${method} ${url}`);
    if (Object.keys(body).length > 0) {
      console.log(`[BODY]`, body);
    }

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        console.log(`[RES] ${method} ${url} - Status: ${statusCode}`);
        if (data) {
          console.log(`[DATA]`, data);
        }
      }),
    );
  }
}
