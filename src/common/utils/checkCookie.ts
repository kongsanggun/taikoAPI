import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function checkCookie(param: any): Promise<any> {
  try {
    const Cookie = param;
    const $ = await axios
      .get('https://donderhiroba.jp/', {
        headers: {
          Cookie: `${Cookie}`,
          'User-Agent': `${process.env.CHROME}`,
        },
      })
      .then((response) => {
        return cheerio.load(response.data);
      });

    if ($('#login_form').html() !== null) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log(`checkCookie is not healthy.`);
    return false;
  }
}
