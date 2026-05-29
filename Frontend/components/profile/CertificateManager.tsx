import { useResumeStore } from '../../store/index';
import EntityManager from '../shared/EntityManager';
import type { LanguageCode } from '../../i18n/languages';
import type { CertificateEntry } from '../../types/profile';

type Props = { lang: LanguageCode };

export default function CertificateManager({ lang }: Props) {
  const certificateEntries = useResumeStore((s) => s.profile.certificateEntries ?? []);
  const { addCertificateEntry, removeCertificateEntry } = useResumeStore();

  return (
    <EntityManager<CertificateEntry>
      lang={lang}
      title={['Сертификаты', 'Certificates']}
      emptyText={['Сертификаты не добавлены', 'No certificates added yet']}
      entities={certificateEntries}
      fieldRows={[
        [{ key: 'name', placeholder: ['Название сертификата', 'Certificate name'] }],
        [
          { key: 'issuer', placeholder: ['Кем выдан', 'Issuer'] },
          { key: 'date', placeholder: ['Дата', 'Date'] },
        ],
      ]}
      onAdd={(data) =>
        addCertificateEntry({
          id: crypto.randomUUID(),
          name: data.name,
          issuer: data.issuer,
          date: data.date,
        })
      }
      onRemove={(i) => removeCertificateEntry(i)}
      maxHeight={160}
      renderCard={(entry) => (
        <>
          <span className="text-xs font-bold text-body truncate block max-w-[200px]">
            {entry.name}
          </span>
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {entry.issuer && (
              <span className="text-[10px] text-secondary">{entry.issuer}</span>
            )}
            {entry.date && (
              <span className="text-[10px] text-muted font-mono">{entry.date}</span>
            )}
          </div>
        </>
      )}
    />
  );
}
