import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

import getDecipher from '../utils/getDecipher';
import getCookie from '../utils/cookie/getCookie';
import checkCookie from 'src/common/utils/checkCookie';
import getCipher from '../utils/getCipher';

@Injectable()
export class cookieIntercetor implements NestInterceptor {
  constructor(private logger: Logger) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const requestBody = context.switchToHttp().getRequest().body;
    context.switchToHttp().getRequest().body = this.interceptBody(requestBody);

    return next.handle().pipe(
      map(async (data) => {
        // 암호화
        data.cookie = await getCipher(data.cookie);
        return await data;
      }),
    );
  }

  private async interceptBody(dto: any): Promise<any> {
    if (typeof dto.cookie === 'string' && dto.cookie.includes(':')) {
      // 복호화
      dto.cookie = await getDecipher(dto.cookie);
    }

    if (!(await checkCookie(dto.cookie))) {
      this.logger.log(
        `${new Date()} ::::: 유효한 토큰이 아닙니다. 토큰을 재발급합니다.`,
      );
      // 토큰 발급
      dto.cookie = await getCookie();
    }

    return dto;
  }
}
