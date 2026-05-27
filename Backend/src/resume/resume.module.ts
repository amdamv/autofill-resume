import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { LatexRendererService } from './latex/renderer/latex-renderer.service';

@Module({
  controllers: [ResumeController],
  providers: [ResumeService, LatexRendererService],
  exports: [ResumeService, LatexRendererService],
})
export class ResumeModule {}
