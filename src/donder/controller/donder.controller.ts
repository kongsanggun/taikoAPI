import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { CrawlingService } from '../service/donder.service';
import { cookieIntercetor } from 'src/common/interceptor/cookie.interceptor';

@UseInterceptors(cookieIntercetor)
@Controller('donder')
export class DonderController {
  constructor(private readonly crawlingService: CrawlingService) {}

  /*
    태고 유저가 존재하는지 확인합니다.
  */
  @Post('id')
  async checkId(@Body() dto: any): Promise<object> {
    return await this.crawlingService.checkId(dto);
  }

  /*
    태고 유저의 곡 기록을 불러옵니다.
  */
  @Post('info')
  async getInfo(@Body() dto: any): Promise<object> {
    return await this.crawlingService.getInfo(dto);
  }
}
