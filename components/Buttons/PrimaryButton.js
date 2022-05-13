import clsx from 'clsx';

export default function PrimaryButton({ className, size, children, onClick, type = 'button', disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
      'flex-1 text-white rounded-lg px-2 border-[0.5px] dark:border-transparent',
      {'btn dark:hover:border-whiteLilac dark:active:bg-cornflower dark:focus:bg-cornflower': !disabled},
      size === 'sm' ? 'py-2' : 'py-3',
      className,
      { 'cursor-not-allowed bg-[#969EAB]': disabled }
      )}
    >
      { children }
    </button>
  );
}