import clsx from 'clsx';

export default function InputField({ value, name, placeholder, type, required, className, size = 'sm', error, onChange}) {
  return (
    <div className={clsx('relative', className)}>
      <input
        type={type}
        value={value}
        name={name}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        className={clsx(
          'input-field bg-lightShade placeholder:text-manatee rounded-md dark:text-white text-ink border-0 w-full',
          size === 'sm' ? 'text-sm' : ''
        )}
      />
      { error && <p className="mt-0.5 absolute text-xxs text-red-600">{ error}</p> }
    </div>
  );
}