import clsx from 'clsx';

export default function PrimaryButton({ className, children, onClick }) {
  return (
    <button type="button" onClick={onClick} className={clsx(
      'flex-1 text-white bg-gradient-to-r from-malibu to-cornflower rounded-lg p-2 border-[0.5px] border-transparent mr-[6px] hover:border-whiteLilac active:bg-cornflower focus:bg-cornflower',
      className ? className : ''
    )}>
      { children }
    </button>
  );
}