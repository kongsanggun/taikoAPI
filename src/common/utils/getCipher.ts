import { ServiceUnavailableException } from '@nestjs/common';
import { randomBytes, createCipheriv, scrypt } from 'crypto';
import { promisify } from 'util';

export default async function getCipher(text: string): Promise<string> {
  try {
    const iv = randomBytes(16);
    const key = (await promisify(scrypt)(
      process.env.KEY,
      'salt',
      32,
    )) as Buffer;

    const cipher = createCipheriv('aes-256-cbc', key, iv);
    const encryptedText = Buffer.concat([cipher.update(text), cipher.final()]);

    return iv.toString('hex') + ':' + encryptedText.toString('hex');
  } catch (error) {
    throw new ServiceUnavailableException('getCipher is not healthy.');
  }
}
