import { IsNotEmpty, IsString, IsOptional, IsObject, ValidateNested, IsArray, IsEmail, IsPhoneNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseSocialLinkDto } from './base-social-link.dto';
import type { CandidateProfile } from '../../../../shared/types/profile';

class ExperienceEntryDto {
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

class SocialLinkDto extends BaseSocialLinkDto {}

class EducationEntryDto {
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

class CertificateEntryDto {
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

  @IsOptional()
  @IsString()
  url?: string;
}

export class CandidateProfileDto implements CandidateProfile {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber()
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
  @Type(() => ExperienceEntryDto)
  experienceEntries?: ExperienceEntryDto[];

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationEntryDto)
  educationEntries?: EducationEntryDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificateEntryDto)
  certificateEntries?: CertificateEntryDto[];
}

export class GenerateResumeDto {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => CandidateProfileDto)
  profile!: CandidateProfileDto;

  @IsNotEmpty()
  @IsString()
  jobDescription!: string;

  @IsOptional()
  @IsString()
  targetLanguage?: string;
}
