import clsx from 'clsx';

export default function Row({ className, children, onClick }) {
  return (
    <div
      role="listitem"
      className={clsx(
        'flex flex-row hover:bg-whiteLilac dark:hover:bg-[#282e34] rounded-xl px-6 py-3 items-center justify-between',
        className
      )}
      onClick={onClick}
    >
      { children }
    </div>
  );
}