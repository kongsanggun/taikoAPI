import { ServiceUnavailableException } from '@nestjs/common';
import { createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';

export default async function getDecipher(text: string): Promise<string> {
  try {
    const textParts = text.split(':');

    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const key = (await promisify(scrypt)(
      process.env.KEY,
      'salt',
      32,
    )) as Buffer;

    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    const decryptedText = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);

    return decryptedText.toString();
  } catch (error) {
    throw new ServiceUnavailableException('getDecipher is not healthy.');
  }
}
