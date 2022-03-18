import clsx from 'clsx';

const getClassnameByType = type => {
  switch (type) {
    case 'left':
      return 'rotate-180';
    case 'up':
      return '-rotate-90';
    case 'down':
      return 'rotate-90';
    default:
      return '';
  }
};

export default function ArrowIcon({ className, type = "right" }) {
  return (
    <svg 
      className={clsx(
        'inline-block',
        className,
        getClassnameByType(type)
      )}
      viewBox="0 0 11 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 1L10 9L1 17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>      
  );
}