import clsx from 'clsx';

export default function PrimaryButton({ className, size, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
      'btn flex-1 text-white rounded-lg px-2 border-[0.5px] border-transparent hover:border-whiteLilac active:bg-cornflower focus:bg-cornflower',
      size === 'sm' ? 'py-2' : 'py-3',
      className
      )}
    >
      { children }
    </button>
  );
}