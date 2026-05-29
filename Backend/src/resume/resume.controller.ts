import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
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
    @Inject(LatexRendererService)
    private readonly latexRendererService: LatexRendererService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  async generateResume(@Body() dto: GenerateResumeDto) {
    return this.resumeService.generateTailoredResume(dto);
  }

  @Post('stream')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  async generateResumeStream(
    @Body() dto: GenerateResumeDto,
    @Res() response: Response,
  ) {
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');
    response.setHeader('X-Accel-Buffering', 'no');

    try {
      await this.resumeService.generateTailoredResumeStream(dto, (event) => {
        response.write(
          `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`,
        );
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Internal server error';
      response.write(
        `event: error\ndata: ${JSON.stringify({ message })}\n\n`,
      );
    }
    response.end();
  }

  @Post('render-pdf')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  async renderPdf(@Body() dto: RenderResumeDto, @Res() response: Response) {
    const pdf = await this.latexRendererService.renderPdf(dto);
    response.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    });

    return response.send(pdf);
  }
}
