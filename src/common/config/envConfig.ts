import { registerAs } from '@nestjs/config';

export default registerAs('', () => ({
  chrome: process.env.CHROME,
  id: process.env.ID,
  password: process.env.PASSWORD,
}));
