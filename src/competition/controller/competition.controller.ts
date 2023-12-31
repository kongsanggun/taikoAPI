import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { CompetitionService } from '../service/competition.service';
import { cookieIntercetor } from 'src/common/interceptor/cookie.interceptor';
import { CompetitionBodyDto } from '../dto/competitionBody.dto';

@UseInterceptors(cookieIntercetor)
@Controller('competition')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  /*
    대회 정보을 불러옵니다.
  */
  @Post('')
  async getCompetition(@Body() dto: CompetitionBodyDto): Promise<object> {
    return await this.competitionService.getCompetition(dto);
  }
}
