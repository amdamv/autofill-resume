import { useResumeStore } from '../../store/index';
import type { LanguageCode } from '../../i18n/languages';
import { getTranslations } from '../../i18n/ui';

type Props = { lang: LanguageCode };

export default function AutofillForm({ lang }: Props) {
  const { webFormFields, setWebFormField, clearWebForm, showFormHighlight } =
    useResumeStore();
  const ext = getTranslations(lang).extension;

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
        <div>
          <label className="text-secondary font-medium block mb-1">
            {ext.labelName}
          </label>
          <input
            type="text"
            value={webFormFields.fullName}
            onChange={(e) => setWebFormField('fullName', e.target.value)}
            placeholder={ext.placeholderName}
            className={`ext-input ${
              showFormHighlight && webFormFields.fullName
                ? 'ext-input--highlighted'
                : 'focus:border-indigo-500'
            }`}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-secondary font-medium block mb-1">
              {ext.labelEmail}
            </label>
            <input
              type="email"
              value={webFormFields.email}
              onChange={(e) => setWebFormField('email', e.target.value)}
              placeholder={ext.placeholderEmail}
              className={`ext-input ${
                showFormHighlight && webFormFields.email
                  ? 'ext-input--highlighted'
                  : 'focus:border-indigo-500'
              }`}
            />
          </div>
          <div>
            <label className="text-secondary font-medium block mb-1">
              {ext.labelPhone}
            </label>
            <input
              type="text"
              value={webFormFields.phone}
              onChange={(e) => setWebFormField('phone', e.target.value)}
              placeholder={ext.placeholderPhone}
              className={`ext-input ${
                showFormHighlight && webFormFields.phone
                  ? 'ext-input--highlighted'
                  : 'focus:border-indigo-500'
              }`}
            />
          </div>
        </div>

        <div>
          <label className="text-secondary font-medium block mb-1">
            {ext.labelSkills}
          </label>
          <input
            type="text"
            value={webFormFields.skills}
            onChange={(e) => setWebFormField('skills', e.target.value)}
            placeholder={ext.placeholderSkills}
            className={`ext-input ${
              showFormHighlight && webFormFields.skills
                ? 'ext-input--highlighted'
                : 'focus:border-indigo-500'
            }`}
          />
        </div>

        <div className="ext-card">
          <div>
            <label className="text-secondary font-medium block mb-1 text-[11px]">
              {ext.labelGitHub}
            </label>
            <input
              type="text"
              value={webFormFields.githubUrl}
              onChange={(e) => setWebFormField('githubUrl', e.target.value)}
              placeholder={ext.placeholderGitHub}
              className={`ext-input-compact ${
                showFormHighlight && webFormFields.githubUrl
                  ? 'ext-input-compact--highlighted'
                  : ''
              }`}
            />
          </div>
          <div className="mt-3">
            <label className="text-secondary font-medium block mb-1 text-[11px]">
              {ext.labelPortfolio}
            </label>
            <input
              type="text"
              value={webFormFields.portfolioUrl}
              onChange={(e) => setWebFormField('portfolioUrl', e.target.value)}
              placeholder={ext.placeholderPortfolio}
              className={`ext-input-compact ${
                showFormHighlight && webFormFields.portfolioUrl
                  ? 'ext-input-compact--highlighted'
                  : ''
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-secondary font-medium block mb-1">
              {ext.labelSalary}
            </label>
            <input
              type="text"
              value={webFormFields.expectedSalary}
              onChange={(e) =>
                setWebFormField('expectedSalary', e.target.value)
              }
              placeholder={ext.placeholderSalary}
              className={`ext-input ${
                showFormHighlight && webFormFields.expectedSalary
                  ? 'ext-input--highlighted'
                  : 'focus:border-indigo-500'
              }`}
            />
          </div>
          <div>
            <label className="text-secondary font-medium block mb-1">
              {ext.labelStartDate}
            </label>
            <input
              type="text"
              value={webFormFields.customNotice}
              onChange={(e) =>
                setWebFormField('customNotice', e.target.value)
              }
              placeholder={ext.placeholderStartDate}
              className={`ext-input ${
                showFormHighlight && webFormFields.customNotice
                  ? 'ext-input--highlighted'
                  : 'focus:border-indigo-500'
              }`}
            />
          </div>
        </div>

        <div>
          <label className="text-secondary font-medium block mb-1">
            {ext.labelAchievements}
          </label>
          <textarea
            value={webFormFields.achievements}
            onChange={(e) => setWebFormField('achievements', e.target.value)}
            placeholder={ext.placeholderAchievements}
            rows={3}
            className={`ext-input text-xs font-sans resize-none ${
              showFormHighlight && webFormFields.achievements
                ? 'ext-input--highlighted font-mono text-[11px]'
                : 'focus:border-indigo-500'
            }`}
          />
        </div>

        <div>
          <label className="text-secondary font-medium block mb-1 text-indigo-400">
            {ext.labelCoverLetter}
          </label>
          <textarea
            value={webFormFields.coverLetter}
            onChange={(e) => setWebFormField('coverLetter', e.target.value)}
            placeholder={ext.placeholderCoverLetter}
            rows={3}
            className={`ext-input resize-none ${
              showFormHighlight && webFormFields.coverLetter
                ? 'ext-input--highlighted'
                : 'focus:border-indigo-500'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
