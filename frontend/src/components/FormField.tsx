import type { Ref } from 'react';

type Props = {
  label: string;
  type: 'text' | 'number' | 'date';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  min?: number;
  className?: string;
  inputRef?: Ref<HTMLInputElement>;
};

export default function FormField({
  label,
  type,
  value,
  onChange,
  placeholder,
  min,
  className,
  inputRef,
}: Props) {
  return (
    <label className='form-control'>
      <div className='label'>
        <span className='label-text'>{label}</span>
      </div>
      <input
        type={type}
        className={className}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        ref={inputRef}
        required
      />
    </label>
  );
}
