import clsx from 'clsx';

export default function Cell({ children, className, grow }) {
  return (
    <div className={clsx('w-auto', className, { grow })}>
      { children }
    </div>
  );
}