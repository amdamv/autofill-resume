import React from 'react';

type Props = {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
  emptyLabel?: string;
  inputValue: string;
  onInputChange: (value: string) => void;
};

export default function TagInput({
  tags, onAdd, onRemove, placeholder, emptyLabel,
  inputValue, onInputChange,
}: Props) {
  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      onInputChange('');
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder={placeholder || 'Add tag...'}
          className="flex-grow px-3 py-2 text-xs bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-2 text-xs font-semibold text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-lg transition-colors"
        >
          +
        </button>
      </div>

      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 bg-[#090a0f]/50 border border-[#20253f]/30 rounded-lg">
        {tags.length === 0 ? (
          <span className="text-[11px] text-slate-600 p-1">
            {emptyLabel || 'No items added...'}
          </span>
        ) : (
          tags.map((tag, index) => (
            <span
              key={index}
              className="text-[11px] flex items-center gap-1 px-2 py-0.5 bg-[#171b30] border border-[#282f56] text-emerald-300 rounded-full"
            >
              {tag}
              <button
                onClick={() => onRemove(tag)}
                className="text-slate-500 hover:text-red-400 font-bold ml-1"
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
