import { IsNotEmpty, IsString, IsOptional, IsObject, ValidateNested, IsArray, IsDefined, ValidateIf, IsEmail, IsNumber, IsPhoneNumber } from 'class-validator';
import { Type } from 'class-transformer';

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

class SocialLinkDto {
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

export class CandidateProfileDto {
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
  @IsNumber()
  @IsPhoneNumber()
  phone?: string;

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
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];
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
