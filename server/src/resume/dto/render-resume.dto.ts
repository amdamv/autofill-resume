import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CandidateProfileDto } from './generate-resume.dto';

export class TailoredResumePdfDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  jobTitle!: string;

  @IsNotEmpty()
  @IsString()
  companyName!: string;

  @IsNotEmpty()
  @IsString()
  tailoredAt!: string;

  @IsNotEmpty()
  @IsString()
  summary!: string;

  @IsArray()
  @IsString({ each: true })
  highlightedSkills!: string[];

  @IsArray()
  @IsString({ each: true })
  tailoredBullets!: string[];

  @IsNotEmpty()
  @IsString()
  coverLetter!: string;
}

export class RenderResumeDto {
  @ValidateNested()
  @Type(() => CandidateProfileDto)
  profile!: CandidateProfileDto;

  @ValidateNested()
  @Type(() => TailoredResumePdfDto)
  resume!: TailoredResumePdfDto;

  @IsOptional()
  @IsString()
  @IsIn(['akhmad-classic', 'compact-ats', 'modern-balanced'])
  templateId?: string;

  @IsOptional()
  @IsString()
  @IsIn(['source', 'backend-core', 'cloud-devops', 'ai-middleware'])
  filterId?: string;
}
