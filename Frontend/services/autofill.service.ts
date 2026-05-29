import type { CandidateProfile } from '../types/profile';
import type { TailoredResume } from '../types/resume';

type CustomField = { id: string; key: string; label: string; value: string };

type FieldItem = {
  key: string;
  label: string;
  value: string;
};

export async function autofillWebForm(params: {
  profile: CandidateProfile;
  scannedResume: TailoredResume | null;
  customFields: CustomField[];
  onSetField: (key: string, value: string) => void;
  onProgress: (step: string | null) => void;
  onDone: () => void;
}): Promise<void> {
  const { profile, scannedResume, customFields, onSetField, onProgress, onDone } = params;

  const inputsToFill: FieldItem[] = [
    { key: 'fullName', label: 'ФИО', value: profile.name },
    { key: 'email', label: 'Email адрес', value: profile.email || '' },
    { key: 'phone', label: 'Номер телефона', value: profile.phone || '' },
    {
      key: 'skills',
      label: 'Навыки',
      value: scannedResume
        ? scannedResume.highlightedSkills.join(', ')
        : profile.skills.join(', '),
    },
    {
      key: 'summary',
      label: 'О себе',
      value: scannedResume
        ? scannedResume.summary
        : 'Инженер-разработчик готовый решать бизнес задачи.',
    },
    {
      key: 'achievements',
      label: 'Опыт работы',
      value: scannedResume
        ? scannedResume.tailoredBullets.join('\n')
        : profile.experience,
    },
    {
      key: 'expectedSalary',
      label: 'ЗП',
      value: customFields.find((f) => f.key === 'salary')?.value || '',
    },
    {
      key: 'githubUrl',
      label: 'GitHub',
      value: customFields.find((f) => f.key === 'github')?.value || '',
    },
    {
      key: 'portfolioUrl',
      label: 'Портфолио',
      value: customFields.find((f) => f.key === 'portfolio')?.value || '',
    },
    {
      key: 'coverLetter',
      label: 'Письмо',
      value: scannedResume
        ? scannedResume.coverLetter
        : 'Здравствуйте! Очень заинтересовала вакансия.',
    },
    {
      key: 'customNotice',
      label: 'Выход на связь / Срок',
      value: customFields.find((f) => f.key === 'noticePeriod')?.value || '',
    },
  ];

  for (const item of inputsToFill) {
    onProgress(`Заполнение: ${item.label}...`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onSetField(item.key, item.value);
  }

  onDone();
}
