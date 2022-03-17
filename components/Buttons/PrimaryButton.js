import clsx from 'clsx';

export default function PrimaryButton({ className, size, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
      'flex-1 text-white rounded-lg px-2 border-[0.5px] border-transparent hover:border-whiteLilac active:bg-cornflower focus:bg-cornflower',
      size === 'sm' ? 'py-2' : 'py-3',
      className
      )}
      style={{background: 'linear-gradient(90deg, #5095FF -0.26%, #6E85FF 99.86%)'}}
    >
      { children }
    </button>
  );
}