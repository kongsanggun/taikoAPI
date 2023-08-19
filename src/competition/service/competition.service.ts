import {
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import getPage from 'src/common/utils/getPage';
import envConfig from 'src/common/config/envConfig';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class CompetitionService {
  constructor(
    @Inject(envConfig.KEY) private config: ConfigType<typeof envConfig>,
  ) {}

  public async getCompetition(param: any): Promise<any> {
    const competitionInfo = await this.getCompetitionInfo(param); // 전체 대회 기록

    return {
      competitionInfo: competitionInfo,
      cookie: param.cookie,
    };
  }

  private async getCompetitionInfo(param: any): Promise<any[]> {
    const result = [];

    const id = param.id;
    const cookie = param.cookie;

    if (id.length === 0) {
      throw new ServiceUnavailableException('요청하신 대회 번호가 없습니다.');
    }

    for (let index = 0; index < id.length; index++) {
      const url = `https://donderhiroba.jp/compe_ranking.php?compeid=${id[index]}`;
      const $ = await getPage(url, cookie);

      const mater = $(`#mater`).html();
      if (this.checkmaterExist(mater)) {
        throw new ServiceUnavailableException(
          '요청하신 대회 번호가 나오지 않았습니다.',
        );
      }

      const pageHTML = mater.trim().split('festivalRankThumbList clearfix');
      pageHTML.shift();

      pageHTML.forEach((item) => {
        result.push(this.getEntryInfo(item));
      });
    }

    return result;
  }

  private checkmaterExist(mater: string): boolean {
    return mater === null || mater === undefined;
  }

  private getEntryInfo(param: string): object {
    const taikoId = param.split('taiko_no')[1].split("'")[0];
    const entryName = param.split('<div>')[1].split('<br>')[0];
    const songScore = [];

    const songDetail = param.split('class="block"')[1].split('<div>');
    songDetail.shift();
    songDetail.forEach((value) => {
      const tmpDetail = value.split('<p>');
      const songName = tmpDetail[1].split('</p>')[0];
      const score = tmpDetail[2].split('</p>')[0];

      songScore.push({
        songName: songName,
        score: score === 'スコア未登録' ? 0 : Number(score.replace('点', '')),
      });
    });

    return {
      taikoId: taikoId.replace('=', ''),
      entryName: entryName,
      songScore: songScore,
    };
  }
}
