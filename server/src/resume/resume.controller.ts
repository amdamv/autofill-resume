import { Body, Controller, HttpCode, HttpStatus, Inject, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ResumeService } from './resume.service';
import { GenerateResumeDto } from './dto/generate-resume.dto';
import { RenderResumeDto } from './dto/render-resume.dto';
import { LatexRendererService } from './latex/latex-renderer.service';

@Controller('generate-resume')
export class ResumeController {
  constructor(
    @Inject(ResumeService) private readonly resumeService: ResumeService,
    @Inject(LatexRendererService) private readonly latexRendererService: LatexRendererService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  async generateResume(@Body() dto: GenerateResumeDto) {
    return this.resumeService.generateTailoredResume(dto);
  }

  @Post('render-pdf')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  async renderPdf(@Body() dto: RenderResumeDto, @Res() response: Response) {
    const pdf = await this.latexRendererService.renderPdf(dto);
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', 'inline; filename="akhmad-akhmedov-resume.pdf"');
    response.send(pdf);
  }
}
