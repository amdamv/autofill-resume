import { useResumeStore } from '../../store/index';
import type { LanguageCode } from '../../i18n/languages';
import { getTranslations } from '../../i18n/ui';
import { FormInput, FormTextarea, FormCompactInput } from '../shared/FormField';

type Props = { lang: LanguageCode };

export default function AutofillForm({ lang }: Props) {
  const { webFormFields, setWebFormField, clearWebForm, showFormHighlight } =
    useResumeStore();
  const ext = getTranslations(lang).extension;

  const hl = (field: string) => showFormHighlight && (webFormFields as any)[field];

  return (
    <div
      className="p-6 space-y-4"
      style={{ backgroundColor: 'rgba(9, 11, 20, 0.15)' }}
    >
      <div className="border-b border-default pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold font-display text-white flex items-center gap-1.5">
            📥 {ext.formTitle}
          </h2>
          <p className="text-[11px] text-secondary">{ext.formHint}</p>
        </div>
        <button onClick={clearWebForm} className="btn-clear-small">
          {ext.clear}
        </button>
      </div>

      <div className="space-y-3.5 text-xs">
        <FormInput
          label={ext.labelName}
          value={webFormFields.fullName}
          onChange={(e) => setWebFormField('fullName', e.target.value)}
          placeholder={ext.placeholderName}
          highlight={hl('fullName')}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label={ext.labelEmail}
            type="email"
            value={webFormFields.email}
            onChange={(e) => setWebFormField('email', e.target.value)}
            placeholder={ext.placeholderEmail}
            highlight={hl('email')}
          />
          <FormInput
            label={ext.labelPhone}
            value={webFormFields.phone}
            onChange={(e) => setWebFormField('phone', e.target.value)}
            placeholder={ext.placeholderPhone}
            highlight={hl('phone')}
          />
        </div>

        <FormInput
          label={ext.labelSkills}
          value={webFormFields.skills}
          onChange={(e) => setWebFormField('skills', e.target.value)}
          placeholder={ext.placeholderSkills}
          highlight={hl('skills')}
        />

        <div className="ext-card">
          <FormCompactInput
            label={ext.labelGitHub}
            value={webFormFields.githubUrl}
            onChange={(e) => setWebFormField('githubUrl', e.target.value)}
            placeholder={ext.placeholderGitHub}
            highlight={hl('githubUrl')}
          />
          <div className="mt-3">
            <FormCompactInput
              label={ext.labelPortfolio}
              value={webFormFields.portfolioUrl}
              onChange={(e) => setWebFormField('portfolioUrl', e.target.value)}
              placeholder={ext.placeholderPortfolio}
              highlight={hl('portfolioUrl')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label={ext.labelSalary}
            value={webFormFields.expectedSalary}
            onChange={(e) => setWebFormField('expectedSalary', e.target.value)}
            placeholder={ext.placeholderSalary}
            highlight={hl('expectedSalary')}
          />
          <FormInput
            label={ext.labelStartDate}
            value={webFormFields.customNotice}
            onChange={(e) => setWebFormField('customNotice', e.target.value)}
            placeholder={ext.placeholderStartDate}
            highlight={hl('customNotice')}
          />
        </div>

        <FormTextarea
          label={ext.labelAchievements}
          value={webFormFields.achievements}
          onChange={(e) => setWebFormField('achievements', e.target.value)}
          placeholder={ext.placeholderAchievements}
          rows={3}
          highlight={hl('achievements')}
        />

        <FormTextarea
          label={ext.labelCoverLetter}
          value={webFormFields.coverLetter}
          onChange={(e) => setWebFormField('coverLetter', e.target.value)}
          placeholder={ext.placeholderCoverLetter}
          rows={3}
          highlight={hl('coverLetter')}
          labelClassName="text-indigo-400"
        />
      </div>
    </div>
  );
}
