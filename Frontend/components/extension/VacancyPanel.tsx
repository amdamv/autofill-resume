import { useResumeStore } from '../../store/index';
import type { LanguageCode } from '../../i18n/languages';
import AutofillForm from './AutofillForm';
import BrowserBar from './BrowserBar';
import VacancySelector from './VacancySelector';
import VacancyDetails from './VacancyDetails';

type Props = { lang: LanguageCode };

export default function VacancyPanel({ lang }: Props) {
  const { selectedJobId, setSelectedJobId } = useResumeStore();

  return (
    <div className="flex-grow xl:w-2/3 bg-header border border-default rounded-2xl overflow-hidden flex flex-col shadow-2xl">
      <BrowserBar selectedJobId={selectedJobId} />

      <VacancySelector
        lang={lang}
        selectedJobId={selectedJobId}
        onChange={setSelectedJobId}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-default flex-grow overflow-y-auto">
        <VacancyDetails lang={lang} selectedJobId={selectedJobId} />
        <AutofillForm lang={lang} />
      </div>
    </div>
  );
}
