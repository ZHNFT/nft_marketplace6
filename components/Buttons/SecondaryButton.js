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
      'flex-1 text-white dark:bg-white/[0.1] bg-cobalt border-[0.5px] rounded-lg py-2 px-4 dark:hover:border-cornflower dark:hover:bg-white/[0.15] hover:bg-cobalt',
      className,
      getClassesBySize(size)
    )}>
      { children }
    </button>
  );
}