import clsx from 'clsx';

export default function PrimaryAltButton({ className, size, children, innerRef, onClick }) {
  return (
    <button type="button" onClick={onClick} ref={innerRef} className={clsx(
      'flex-1 rounded-lg px-2 text-ink bg-white/[0.9] border-[0.5px] border-cornflower ',
      size === 'sml' ? 'py-2' : 'py-3',
      className
    )}>
      { children }
    </button>
  );
}