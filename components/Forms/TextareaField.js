import clsx from 'clsx';

export default function TextareaField({ value, name, placeholder, required, className, height, size = 'sm', error, onChange}) {
  return (
    <div className={clsx('relative', className)}>
      <textarea
        value={value}
        name={name}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        className={clsx(
          'input-field rounded-md text-white border-0 w-full py-4 resize-none',
          size === 'sm' ? 'text-xs' : '',
          height
        )}
      />
      { error && <p className="mt-0.5 absolute text-xxs text-red-600">{ error}</p> }
    </div>
  );
}