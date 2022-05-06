import clsx from 'clsx';

export default function TextareaField({ value, name, placeholder, required, className, maxLength, height, size = 'sm', error, onChange}) {
  return (
    <div className={clsx('relative', className)}>
      <textarea
        value={value}
        name={name}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        maxLength={maxLength}
        className={clsx(
          'input-field bg-lightShade placeholder:text-manatee rounded-md dark:text-white text-ink border-0 w-full !py-4 resize-none',
          size === 'sm' ? 'text-sm' : '',
          height
        )}
      />
      { 
        maxLength && (
          <p className="absolute right-2 -bottom-3.75 text-xxs">
            {value?.length || 0} of {maxLength} <span className="dark:text-manatee text-frost">characters used</span>
          </p>
        )
      }
      { error && <p className="absolute text-xxs text-red-600">{ error}</p> }
    </div>
  );
}