import { IsNotEmpty, IsString, IsOptional, IsObject, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CandidateProfileDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

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
