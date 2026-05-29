import { Linkedin, Github, Globe, Youtube, Twitter, MessageCircle, Camera, Code2 } from 'lucide-react';
import { cn } from '../../lib/cn';

const SOCIAL_PLATFORMS = [
  { id: 'linkedin', icon: 'Linkedin', label: 'LinkedIn' },
  { id: 'github', icon: 'Github', label: 'GitHub' },
  { id: 'twitter', icon: 'Twitter', label: 'X / Twitter' },
  { id: 'youtube', icon: 'Youtube', label: 'YouTube' },
  { id: 'telegram', icon: 'MessageCircle', label: 'Telegram' },
  { id: 'instagram', icon: 'Camera', label: 'Instagram' },
  { id: 'stackoverflow', icon: 'Code2', label: 'Stack Overflow' },
  { id: 'website', icon: 'Globe', label: 'Website' },
  { id: 'other', icon: 'Globe', label: 'Other' },
] as const;

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Linkedin, Github, Globe, Youtube, Twitter, MessageCircle, Camera, Code2,
};

export function PlatformIcon({ iconId, size = 14 }: { iconId: string; size?: number }) {
  const Icon = iconMap[iconId] || Globe;
  return <Icon size={size} />;
}

type Props = {
  selectedPlatform: string;
  onSelect: (id: string) => void;
};

export default function PlatformGrid({ selectedPlatform, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-2">
      {SOCIAL_PLATFORMS.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-all',
            selectedPlatform === p.id
              ? 'bg-indigo-600 text-white ring-1 ring-indigo-400'
              : 'bg-panel text-secondary hover:text-body hover:bg-default/20',
          )}
          title={p.label}
        >
          <PlatformIcon iconId={p.icon} />
          {p.label}
        </button>
      ))}
    </div>
  );
}
