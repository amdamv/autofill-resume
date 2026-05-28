import type { LanguageCode } from '../../i18n/languages';
import VacancyPanel from './VacancyPanel';
import ExtensionSidebar from './ExtensionSidebar';

type Props = { lang?: LanguageCode };

export default function ExtensionSimulator({ lang = 'ru' }: Props) {
  return (
    <div className="h-full flex flex-col xl:flex-row gap-6 pb-12">
      <VacancyPanel lang={lang} />
      <ExtensionSidebar lang={lang} />
    </div>
  );
}
