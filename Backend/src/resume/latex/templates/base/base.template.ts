import type { ITemplate, TemplateMeta, TemplateSection, TemplateStyles } from '../../types';
import { generatePreamble } from '../../constants/template-settings';

export abstract class BaseTemplate implements ITemplate {
  abstract meta: TemplateMeta;
  abstract styles: TemplateStyles;
  abstract sections: TemplateSection[];

  generatePreamble(): string {
    return generatePreamble(this);
  }
}
