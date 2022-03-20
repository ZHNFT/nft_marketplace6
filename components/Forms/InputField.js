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
          'input-field rounded-md text-white border-0 w-full',
          size === 'sm' ? 'text-xs' : ''
        )}
      />
      { error && <p className="mt-0.5 absolute text-xxs text-red-600">{ error}</p> }
    </div>
  );
}