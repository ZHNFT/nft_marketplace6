import clsx from 'clsx';

export default function SecondaryButton({ className, children, onClick }) {
  return (
    <button type="button" onClick={onClick} className={clsx(
      'flex-1 text-white bg-white/[0.1] border-[0.5px] rounded-lg p-2 hover:border-cornflower',
      className ? className : ''
    )}>
      { children }
    </button>
  );
}