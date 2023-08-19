import { IsArray, IsOptional, IsString } from 'class-validator';

export class CompetitionBodyDto {
  @IsArray({
    message: '올바른 ID 요청 typeof이 아닙니다.',
  })
  id: []; // 대회 고유 ID

  @IsOptional()
  @IsString({
    message: '올바른 요청 typeof이 아닙니다.',
  })
  cookie?: string;
}
