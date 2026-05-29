import {
  IsArray,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PdfSocialLinkDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  url?: string;
}

export class PdfCandidateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsString()
  github?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  certificateEntries?: Array<{
    name: string;
    issuer: string;
    date?: string;
  }>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PdfSocialLinkDto)
  socialLinks?: PdfSocialLinkDto[];
}

export class TailoredResumePdfDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  tailoredAt?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlightedSkills?: string[];

  @IsOptional()
  @IsArray()
  categorizedSkills?: { category: string; skills: string[] }[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tailoredBullets?: string[];

  @IsOptional()
  @IsString()
  coverLetter?: string;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  experience?: Array<{
    company?: string;
    position?: string;
    dates?: string;
    location?: string;
    bullets?: string[];
  }>;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  projects?: Array<{
    name?: string;
    stack?: string;
    bullets?: string[];
  }>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certificates?: string[];
}

export class RenderResumeDto {
  @IsObject()
  @ValidateNested()
  @Type(() => PdfCandidateProfileDto)
  profile!: PdfCandidateProfileDto;

  @IsObject()
  @ValidateNested()
  @Type(() => TailoredResumePdfDto)
  resume!: TailoredResumePdfDto;

  @IsOptional()
  @IsArray()
  portfolioCategorizedSkills?: { category: string; skills: string[] }[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  portfolioCategoryOrder?: string[];

  @IsOptional()
  @IsString()
  @IsIn(['akhmad-classic', 'compact-ats', 'modern-balanced'])
  templateId?: string;

  @IsOptional()
  @IsString()
  @IsIn(['source', 'backend-core', 'cloud-devops', 'ai-middleware'])
  filterId?: string;
}
