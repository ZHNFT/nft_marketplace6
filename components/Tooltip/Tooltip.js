import clsx from 'clsx';

export default function Tooltip({ children, className, position }) {
  return (
    <span className={clsx(
      'group-hover:visible absolute rounded-md text-[10px] transition-all duration-100 py-1 px-3 text-center min-w-max border-[0.5px] border-cornflower leading-normal invisible',
      'z-10 bg-gradient-to-b from-whiteLilac to-[#fff] dark:from-[#293646] dark:to-[#262b31]',
      'before:block before:m-auto before:w-[10px] before:absolute before:left-0 before:right-0 before:border-[6px] before:border-transparent before:border-b-cornflower',
      'after:block after:m-auto after:w-[10px] after:absolute after:left-0 after:right-0 after:border-[5px] after:border-transparent after:border-b-whiteLilac dark:after:border-b-[#293646]',
      position === 'bottom' ? 'left-0 right-0 -bottom-[48px] before:bottom-full after:bottom-full' : '',
      className
    )}>
      { children }
    </span>
  );
}