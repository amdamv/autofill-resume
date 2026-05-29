import { useResumeStore } from '../../store/index';
import EntityManager from '../shared/EntityManager';
import type { LanguageCode } from '../../i18n/languages';
import type { EducationEntry } from '../../types/profile';

type Props = { lang: LanguageCode };

export default function EducationManager({ lang }: Props) {
  const educationEntries = useResumeStore((s) => s.profile.educationEntries ?? []);
  const { addEducationEntry, removeEducationEntry } = useResumeStore();

  return (
    <EntityManager<EducationEntry>
      lang={lang}
      title={['Образование', 'Education']}
      emptyText={['Образование не добавлено', 'No education added yet']}
      entities={educationEntries}
      fieldRows={[
        [{ key: 'institution', placeholder: ['Учебное заведение', 'Institution'] }],
        [
          { key: 'degree', placeholder: ['Степень', 'Degree'] },
          { key: 'field', placeholder: ['Специальность', 'Field of study'] },
        ],
        [
          { key: 'dates', placeholder: ['Период', 'Period'] },
          { key: 'location', placeholder: ['Локация', 'Location'] },
        ],
      ]}
      onAdd={(data) =>
        addEducationEntry({
          id: crypto.randomUUID(),
          institution: data.institution,
          degree: data.degree,
          field: data.field,
          dates: data.dates,
          location: data.location,
        })
      }
      onRemove={(i) => removeEducationEntry(i)}
      maxHeight={224}
      renderCard={(entry) => (
        <>
          <span className="text-xs font-bold text-body truncate block max-w-[200px]">
            {entry.institution}
          </span>
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {entry.degree && (
              <span className="text-[10px] text-secondary">
                {entry.degree}
                {entry.field ? `, ${entry.field}` : ''}
              </span>
            )}
            {entry.dates && (
              <span className="text-[10px] text-muted font-mono">{entry.dates}</span>
            )}
          </div>
          {entry.location && (
            <span className="text-[10px] text-muted block">{entry.location}</span>
          )}
        </>
      )}
    />
  );
}
