import {
  IsArray,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseSocialLinkDto } from './base-social-link.dto';

class PdfSocialLinkDto extends BaseSocialLinkDto {}

class PdfExperienceEntryDto {
  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  dates?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bullets?: string[];
}

class PdfEducationEntryDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  institution?: string;

  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsString()
  dates?: string;

  @IsOptional()
  @IsString()
  location?: string;
}

class PdfCertificateEntryDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @IsString()
  date?: string;
}

export class PdfCandidateProfileDto {
  @IsString()
  name!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

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
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PdfExperienceEntryDto)
  experienceEntries?: PdfExperienceEntryDto[];

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PdfEducationEntryDto)
  educationEntries?: PdfEducationEntryDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PdfSocialLinkDto)
  socialLinks?: PdfSocialLinkDto[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  certificateEntries?: PdfCertificateEntryDto[];
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
  @ValidateNested({ each: true })
  @Type(() => PdfExperienceEntryDto)
  experience?: PdfExperienceEntryDto[];

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
