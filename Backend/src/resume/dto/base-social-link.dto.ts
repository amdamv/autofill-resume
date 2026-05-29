import { IsOptional, IsString } from 'class-validator';

export class BaseSocialLinkDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  url?: string;
}
