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
          className="input-primary"
        />
        <button
          onClick={handleAdd}
          className="btn-add"
        >
          +
        </button>
      </div>

      <div className="tag-container">
        {tags.length === 0 ? (
          <span className="text-[11px] text-muted p-1">
            {emptyLabel || 'No items added...'}
          </span>
        ) : (
          tags.map((tag, index) => (
            <span
              key={index}
              className="tag-pill"
            >
              {tag}
              <button
                onClick={() => onRemove(tag)}
                className="text-muted hover:text-red-400 font-bold ml-1"
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
