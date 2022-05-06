import clsx from 'clsx';

const getClassesBySize = size => {
  switch (size) {
    case 'xs':
      return 'p-2';
    case 'sm':
      return 'py-2 px-4';
    default:
      return '';
  }
};

export default function SecondaryButton({ className, size = 'sm', children, onClick }) {
  return (
    <button type="button" onClick={onClick} className={clsx(
      'flex-1 dark:text-white text-ink dark:bg-white/[0.1] bg-silver/[0.1] border-[0.5px] rounded-lg py-2 px-4 hover:border-cornflower hover:bg-white/[0.15]',
      className,
      getClassesBySize(size)
    )}>
      { children }
    </button>
  );
}