import { ServiceUnavailableException } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function getPage(
  url: string,
  cookie: string,
): Promise<cheerio.CheerioAPI> {
  const response = await axios.get(url, {
    headers: {
      Cookie: `${cookie}`,
      'User-Agent': `${process.env.CHROME}`,
    },
  });

  if (response.status !== 200 || !response.data) {
    throw new ServiceUnavailableException(`${url} is not healthy.`);
  }
  return cheerio.load(response.data);
}
