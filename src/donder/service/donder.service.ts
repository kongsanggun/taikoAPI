import {
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import getPage from 'src/common/utils/getPage';
import envConfig from 'src/common/config/envConfig';
import { ConfigType } from '@nestjs/config';
import { CheerioAPI } from 'cheerio';

@Injectable()
export class CrawlingService {
  constructor(
    @Inject(envConfig.KEY) private config: ConfigType<typeof envConfig>,
  ) {}

  public async checkId(param: any): Promise<object> {
    const isUserExist = await this.getUserPage(param)['isUserExist'];

    return {
      isUserExist: isUserExist,
      cookie: param.cookie,
    };
  }

  private async getUserPage(param: any): Promise<object> {
    const id = param.id;
    const cookie = param.cookie;
    const url = `https://donderhiroba.jp/user_profile.php?taiko_no=${id}`;

    const $ = await getPage(url, cookie);

    if (this.checkUserExist($)) {
      return {
        isUserExist: false,
        userInfo: null,
      };
    } else {
      const userInfo = await this.getUserDetail($, id);

      return {
        isUserExist: true,
        userInfo: userInfo,
      };
    }
  }

  private checkUserExist($: CheerioAPI): boolean {
    const isUser = $(`#mydon_area > div.total_score`).html();
    return isUser === null || isUser === undefined;
  }

  private async getUserDetail($: CheerioAPI, id: string): Promise<object> {
    const scoreInfoHTML = $(`#mydon_area > div.total_score`)
      .html()
      .split('</div>');
    const title = $(`#mydon_area > div`).html().trim();
    const name = $(`#mydon_area > div:nth-child(3) > div`).html().trim();
    const crown = this.getUserCrown(scoreInfoHTML.slice(-4, -1));
    const patch = this.getUserPatch(scoreInfoHTML.slice(0, -4));

    return {
      title: title,
      id: id,
      name: name,
      crown: crown,
      patch: patch,
    };
  }

  private getUserCrown(inputArray: string[]): object {
    const result = inputArray.map((item: string) => {
      return Number(item.split('>').pop());
    });

    return {
      silverCrownCount: result[0],
      goldCrownCount: result[1],
      donderfulCrownCount: result[2],
    };
  }

  private getUserPatch(inputArray: string[]): object {
    const result = inputArray.map((item: string) => {
      return Number(item.split('>').pop());
    });

    return {
      patch2Count: result[6],
      patch3Count: result[5],
      patch4Count: result[4],
      patch5Count: result[3],
      patch6Count: result[2],
      patch7Count: result[1],
      patch8Count: result[0],
    };
  }

  public async getInfo(param: any): Promise<object> {
    const userInfo = await this.getUserInfo(param); // 전체 기록
    const songInfo = await this.getAllSongInfo(param); // 각 노래 기록

    return {
      userInfo: userInfo,
      songInfo: songInfo,
      cookie: param.cookie,
    };
  }

  private async getUserInfo(param: any): Promise<object> {
    const userInfo = await this.getUserPage(param);

    if (!userInfo['isUserExist']) {
      throw new ServiceUnavailableException(
        '요청하신 유저 정보가 맞지 않습니다.',
      );
    }

    return userInfo['userInfo'];
  }

  private async getAllSongInfo(param: any): Promise<any[]> {
    const result = [];

    for (let index = 1; index <= 8; index++) {
      const id = param.id;
      const cookie = param.cookie;
      const url = `https://donderhiroba.jp/score_list.php?genre=${index}&taiko_no=${id}`;

      const $ = await getPage(url, cookie);
      const pageHTML = $(`#tab-genre${index}`).html().trim().split('devil">');
      pageHTML.shift();

      pageHTML.forEach((item) => {
        const songInfo = this.getSongInfo(item);
        const tmpIndex = songInfo['songId'] + (songInfo['isUra'] ? 10000 : 0);
        result[tmpIndex] = songInfo;
      });
    }

    return result.filter(() => true);
  }

  private getSongInfo(param: string): object {
    const name = param.split('</span>')[0].split('>')[2];
    const songId = Number(param.split('song_no=')[1].split('&')[0]);

    const crownInfo = param
      .split('oni')[1]
      .split('crown_button_')[1]
      .split('_');
    const crown = crownInfo[0];
    const patch = crownInfo[0] === 'none' ? 'none' : crownInfo[1];

    const isUra = param.includes('ura');

    return {
      songId: songId,
      name: name,
      crown: crown,
      patch: patch,
      isUra: isUra,
    };
  }
}
