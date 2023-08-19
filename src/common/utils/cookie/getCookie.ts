import { ServiceUnavailableException } from '@nestjs/common';
import axios from 'axios';

export default async function getCookie(): Promise<any> {
  try {
    const cookie = await getLoginResponse()
      .then(async (response) => {
        return await getAuthResponse(response);
      })
      .then(async (response) => {
        return await getProcessResponse(response);
      })
      .then(async (response) => {
        const url = 'https://account.bandainamcoid.com/';
        await getRedirectResponse(response, url);

        return response['cookie'];
      });

    await getLoginSelectResponse(cookie).then(async (response) => {
      const url = 'https://donderhiroba.jp/login_select.php';
      return await getRedirectResponse(response, url);
    });

    return await cookie;
  } catch (error) {
    throw new ServiceUnavailableException(`getCookie is not healthy.`);
  }
}

async function getLoginResponse(): Promise<object> {
  const response = await axios.post(
    `https://account-api.bandainamcoid.com/v3/login/idpw?client_id=nbgi_taiko&redirect_uri=https%3A%2F%2Fwww.bandainamcoid.com%2Fv2%2Foauth2%2Fauth%3Fback%3Dv3%26client_id%3Dnbgi_taiko%26scope%3DJpGroupAll%26redirect_uri%3Dhttps%253A%252F%252Fdonderhiroba.jp%252Flogin_process.php%253Finvite_code%253D%2526abs_back_url%253D%2526location_code%253D%26text%3D&customize_id=&login_id=${process.env.ID}&password=${process.env.PASSWORD}&shortcut=0&retention=1&language=ko&cookie=%7B%22language%22%3A%22ko%22%2C%22OptanonAlertBoxClosed%22%3A%222023-08-06T06%3A19%3A46.431Z%22%2C%22retention_tmp%22%3A%221%22%2C%22mnwlogindata%22%3A%226320b99de33868d68329321ac8d628b63635e580f432ad52b44f428dbb7327a8f304a977f3111cbaad561d544ee28dab84f5194db1606973%22%2C%22retention%22%3A%221%22%2C%22wwwglobal%22%3A%221%22%2C%22OptanonConsent%22%3A%22isGpcEnabled%3D0%26datestamp%3DSun+Aug+06+2023+16%3A12%3A45+GMT%2B0900+(%ED%95%9C%EA%B5%AD+%ED%91%9C%EC%A4%80%EC%8B%9C)%26version%3D6.33.0%26isIABGlobal%3Dfalse%26hosts%3D%26consentId%3D400b7e05-0f7d-4d3e-b76e-be0ef1ef9f50%26interactionCount%3D1%26landingPath%3DNotLandingPage%26groups%3DC0004%3A0%2CC0003%3A0%2CC0002%3A0%2CC0001%3A1%26geolocation%3DKR%3B11%26AwaitingReconsent%3Dfalse%22%7D&prompt=login`,
    {
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        Referer: 'https://account.bandainamcoid.com/',
        'User-Agent': `${process.env.CHROME}`,
      },
    },
  );

  return {
    loginRedirect: response.data.redirect,
    loginCookie: response.data.cookie.mnw.value,
  };
}

async function getAuthResponse(param: object): Promise<string> {
  return await axios
    .get(param['loginRedirect'], {
      headers: {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        Cookie: `mnwlogindata=${param['loginCookie']}; wwwglobal=1; login_common=1`,
        Referer: 'https://account.bandainamcoid.com/',
        'User-Agent': `${process.env.CHROME}`,
      },
      maxRedirects: 0,
    })
    .catch((err) => {
      return err.response.headers.location;
    });
}

async function getProcessResponse(param: string): Promise<object> {
  const response = await axios
    .get(param, {
      headers: {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        Referer: 'https://account.bandainamcoid.com/',
        'User-Agent': `${process.env.CHROME}`,
      },
      maxRedirects: 0,
    })
    .catch((err) => {
      return err.response.headers;
    });

  return {
    redirect: response.location,
    cookie: response['set-cookie'][2].split(';')[0],
  };
}

async function getLoginSelectResponse(cookie: string): Promise<object> {
  const location = await axios({
    method: 'post',
    url: 'https://donderhiroba.jp/login_select.php',
    headers: {
      Accept: '*/*',
      'Accept-Encoding': 'ko,en;q=0.9,en-US;q=0.8',
      'Content-Length': '18',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Cookie: cookie,
      Origin: 'https://donderhiroba.jp',
      Referer: 'https://donderhiroba.jp/login_select.php',
      'User-Agent': `${process.env.CHROME}`,
    },
    data: {
      id_pos: 1,
      mode: 'exec',
    },
    maxRedirects: 0,
  }).catch((err) => {
    return err.response.headers.location;
  });

  return {
    redirect: location,
    cookie: cookie,
  };
}

async function getRedirectResponse(
  params: object,
  Referer: string,
): Promise<void> {
  await axios
    .get(params['redirect'], {
      headers: {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        Cookie: `${params['cookie']}`,
        Referer: `${Referer}`,
        'User-Agent': `${process.env.CHROME}`,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new ServiceUnavailableException(`getCookie is not healthy.`);
      }
    });
}
