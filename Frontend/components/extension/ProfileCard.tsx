import type { LanguageCode } from '../../i18n/languages';
import { getTranslations } from '../../i18n/ui';
import type { CandidateProfile } from '../../types/profile';

type Props = {
  lang: LanguageCode;
  profile: CandidateProfile;
};

export default function ProfileCard({ lang, profile }: Props) {
  const ext = getTranslations(lang).extension;

  return (
    <div className="bg-panel/80 rounded-xl p-3 border border-default space-y-2">
      <span className="text-[10px] font-bold text-muted uppercase tracking-widest block">
        {ext.extCurrentProfile}
      </span>
      <div className="text-[11px] text-body space-y-1">
        <div className="flex justify-between">
          <span className="text-muted">{ext.extName}</span>
          <span className="font-medium truncate max-w-[150px]">
            {profile.name}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">{ext.extTitle}</span>
          <span className="text-emerald-400 font-mono truncate max-w-[150px]">
            {profile.title}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">{ext.extContact}</span>
          <span className="text-indigo-300 font-mono truncate max-w-[150px]">
            {profile.email}
          </span>
        </div>
      </div>
    </div>
  );
}
