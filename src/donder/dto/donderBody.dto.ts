import { IsOptional, IsString, Length } from 'class-validator';

export class DonderBodyDto {
  @IsString({
    message: '올바른 요청 typeof이 아닙니다.',
  })
  @Length(12, 12, { message: 'ID를 12자로 맞추어주세요.' })
  id: string; // 북 번호

  @IsOptional()
  @IsString({
    message: '올바른 요청 typeof이 아닙니다.',
  })
  cookie?: string;
}
